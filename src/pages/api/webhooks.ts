import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../server/db/client'

type DreamImage = {
  seed: number,
  image: string,
}

type GenerateImageWebhookBody = {
  images: DreamImage[],
  job_id: string,
  time: number,
}

type UpscaleImageWebhookBody = {
  file_url: string,
  job_id: string,
}

const generateImageHandler = async (req: NextApiRequest) => {
  const { images, job_id, time } = req.body as GenerateImageWebhookBody

  for (const image of images) {
    await prisma.dreamImage.create({
      data: {
        seed: image.seed,
        image: image.image,
        dreamId: job_id,
      }
    })
  }

  await prisma.dream.update({
    where: {
      id: job_id,
    },
    data: {
      status: 'complete',
      totalTime: time
    }
  })
}

const upscaleImageHandler = async (req: NextApiRequest) => {
  const { file_url: image, job_id: jobID } = req.body as UpscaleImageWebhookBody

  await prisma.upscaledDream.update({
    where: {
      id: jobID,
    },
    data: {
      upscaledImageURL: image,
      status: 'complete',
    }
  })
}

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query.action)

  switch (req.query.action) {
    case 'generate-image':
      await generateImageHandler(req)
      break;
    case 'upscale-image':
      await upscaleImageHandler(req)
      break;
    default:
      return res.status(404).send('Not found')
  }

  res.status(201).json({ message: 'ok' })
}

export default webhook

