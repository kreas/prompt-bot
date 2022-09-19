import { z } from 'zod'
import { createProtectedRouter } from './protected-router'
import { prisma } from '../db/client'
import axios from 'axios'

const default_scale = 4

// Example router with queries that can only be hit if the user requesting is signed in
const dreamRouter = createProtectedRouter()
  .mutation('upscale', {
    input: z.object({
      imageId: z.string(),
    }),
    async resolve({ ctx, input }) {
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

      const response = await axios.post(process.env.DREAMER_URL + '/upscale', {
        image_url: dreamImage.image,
        scale: default_scale,
      }, {
        headers: {
          'X-API-KEY': process.env.DREAMER_API_KEY || '',
          'X-WEBHOOK-URL': process.env.UPSCALER_WEBHOOK_URL || '',
          'Content-Type': 'application/json',
        }
      })

      const { job_id: jobID } = response?.data

      if (jobID) {
        await prisma.upscaledDream.upsert({
          where: {
            dreamImageId: input.imageId,
          },
          update: {
            id: response.data.job_id as string,
            dreamImageId: input.imageId,
            scale: default_scale,
          },
          create: {
            id: response.data.job_id as string,
            dreamImageId: input.imageId,
            scale: default_scale,
          }
        })

        return { jobID }
      }

      return { error: 'Failed to create job' }
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
