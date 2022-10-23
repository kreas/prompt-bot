import { aspectToPixels, qualityToSteps } from 'src/utils/translateDreamParameters'
import { createProtectedRouter } from './protected-router'
import { initRedisClient } from 'src/utils/redisClient'
import { prisma } from '../db/client'
import { randomUUID } from 'crypto'
import { z } from 'zod'

const DEFAULT_SCALE = 2

// Example router with queries that can only be hit if the user requesting is signed in
const dreamRouter = createProtectedRouter()
  .query('fetch',{
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await prisma.dream.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          dreamImages: {
            include: {
              upscaledDream: true
            }
          },
        }
      })
    },
  })
  .mutation('create', {
    input: z.object({
      prompt: z.string(),
      aspectRatio: z.enum(['1:1', '2:3', '3:2', '16:9']).default('1:1'),
      quality: z.enum(['low', 'mid', 'high', 'max']).default('mid'),
      seed: z.number().min(0).default(0),
      seedLocked: z.boolean().default(false),
    }),
    async resolve({ ctx, input }) {
      const client = initRedisClient()
      const  { width, height } = aspectToPixels(input.aspectRatio)
      const steps = qualityToSteps(input.quality)
      const seed = input.seedLocked ? input.seed : Math.floor(Math.random() * 1_000_000)

      const payload = {
        webhook_url: process.env.DREAMER_WEBHOOK_URL,
        job_id: randomUUID(),
        prompt: input.prompt,
        width,
        height,
        steps,
        seed,
      }

      await client.rpush('generate_images', JSON.stringify(payload))

      await prisma.dream.create({
        data: {
          id: payload.job_id,
          height: payload.height * 2,
          width: payload.width * 2,
          seed: payload.seed,
          steps: payload.steps,
          prompt: payload.prompt,
          userId: ctx.session.user.id,
        }
      })

      client.disconnect()

      return { jobID: payload.job_id }
    }
  })
  .mutation('upscale', {
    input: z.object({
      imageId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const client = initRedisClient()
      const dreamImage = await prisma.dreamImage.findFirst({
        where: {
          id: input.imageId,
          dream: {
            userId: ctx.session.user.id,
          }
        },
        select: {
          image: true,
        }
      })

      if (!dreamImage) return { error: 'Dream image not found' }

      const payload = {
        job_id: randomUUID(),
        image_url: dreamImage.image,
        scale: DEFAULT_SCALE,
        webhook_url: process.env.UPSCALER_WEBHOOK_URL,
      }

      const jobID: string = payload.job_id

      await client.rpush('upscale_images', JSON.stringify(payload))

      await prisma.upscaledDream.upsert({
        where: {
          dreamImageId: input.imageId,
        },
        update: {
          id: jobID,
          dreamImageId: input.imageId,
          scale: DEFAULT_SCALE,
        },
        create: {
          id: jobID,
          dreamImageId: input.imageId,
          scale: DEFAULT_SCALE,
        }
      })

      client.disconnect()

      return { jobID }
    }
  })
  .query('upscaleStatus', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.upscaledDream.findFirst({
        where: {
          id: input.id,
        },
        select: {
          status: true,
        }
      })
    }
  })

export default dreamRouter
