import { createProtectedRouter } from './protected-router'

// Example router with queries that can only be hit if the user requesting is signed in
export const galleryRouter = createProtectedRouter()
  .query('my-items', {
    resolve({ ctx }) {
      const dreams = prisma?.dream.findMany({
        where: {
          userId: ctx.session.user?.id,
          status: 'complete',
        },
        include: {
          dreamImages: {
            include: {
              FavoriteDreams: {
                where: {
                  userId: ctx.session.user?.id,
                }
              }
            },
          },
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      })

        console.log(dreams)
        return dreams
      },
    })
  .query('getSecretMessage', {
    resolve({ ctx }) {
      return 'He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.'
    },
  })
