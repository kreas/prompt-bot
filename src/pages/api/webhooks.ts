import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../server/db/client'

type DreamImage = {
  seed: number,
  image: string,
}

type WebhookBody = {
  images: DreamImage[],
  job_id: string,
  time: number,
}

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const { images, job_id, time } = req.body as WebhookBody

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

  res.status(201).json({ message: 'ok' })
}

export default webhook
