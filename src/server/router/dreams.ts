import { z } from 'zod'
import { createProtectedRouter } from './protected-router'
import { prisma } from '../db/client'
import axios from 'axios'

const default_scale = 4

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
          dreamImages: true,
        }
      })
    },
  })
  .mutation('create', {
    input: z.object({
      prompt: z.string(),
      height: z.number().min(448).max(768).step(64).default(512),
      width: z.number().min(448).max(768).step(64).default(512),
      steps: z.number().min(30).max(100).default(50),
      seed: z.number().min(0).default(0),
    }),
    async resolve({ ctx, input }) {
      const response = await axios.post(process.env.DREAMER_URL || '', input, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.DREAMER_API_KEY || '',
          'X-WEBHOOK-URL': process.env.DREAMER_WEBHOOK_URL || '',
        }
      })

      await prisma.dream.create({
        data: {
          id: response.data.job_id,
          height: input.height,
          width: input.width,
          seed: input.seed,
          steps: input.steps,
          prompt: input.prompt,
          userId: ctx.session.user.id,
        }
      })

      return { jobID: response.data.job_id }
    }
  })
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
