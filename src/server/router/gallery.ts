import { z } from 'zod'
import { createProtectedRouter } from './protected-router'
import { prisma } from '../db/client'

// Example router with queries that can only be hit if the user requesting is signed in
const galleryRouter = createProtectedRouter()
  .mutation('toggle-favorite', {
    input: z.object({
      imageId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { imageId } = input

      const favoriteDream = await prisma.favoriteDream.findFirst({
        where: {
          userId: ctx.session.user.id,
          dreamImageId: imageId,
        }
      })

      if (favoriteDream) {
        return await prisma.favoriteDream.delete({
          where: { id: favoriteDream.id }
        })
      } else {
        return await prisma.favoriteDream.create({
          data: {
            userId: ctx.session.user.id,
            dreamImageId: imageId,
          }
        })
      }
    }
  })
  .query('my-items', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish().default(20),
      cursor: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 50
      const { cursor } = input

      const dreams = await prisma?.dream.findMany({
        where: {
          userId: ctx.session.user?.id,
          status: 'complete',
        },
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          dreamImages: {
            include: {
              FavoriteDreams: {
                where: {
                  userId: ctx.session.user?.id,
                },
              },
            },
          },
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit + 1,
      })

      let nextCursor: typeof cursor | null = null

      if (dreams && dreams.length > limit) {
        const nextItem = dreams.pop()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id
      }

      return {
        dreams,
        nextCursor: nextCursor
      }
    },
  })

export default galleryRouter
