import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/db/client'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const jobId = req.query.jobId as string

  const dream = await prisma.dream.findFirst({
    where: {
      id: jobId,
    }
  })

  if (!dream) {
    return res.status(404).json({ error: 'Not found' })
  }


  if (dream.status === 'pending') {
    return res.status(200).json({ status: dream.status })
  }

  const images = await prisma.dreamImage.findMany({
    where: {
      dreamId: jobId,
    }
  })

  res.status(200).json(images)
}

export default handler
