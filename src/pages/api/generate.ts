import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../server/db/client'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

const generate = async (req: NextApiRequest, res: NextApiResponse) => {
  const DREAMER_URL = process.env.DREAMER_URL
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (!DREAMER_URL) {
    res.status(500).json({ error: 'DREAMER_URL not set' })
    return
  }

  const response = await axios.post(DREAMER_URL, req.body, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.DREAMER_API_KEY || '',
      'X-WEBHOOK-URL': process.env.DREAMER_WEBHOOK_URL || '',
    }
  }) 

  await prisma.dream.create({
    data: {
      id: response.data.job_id,
      height: req.body.height,
      width: req.body.width,
      seed: req.body.seed,
      steps: req.body.steps,
      prompt: req.body.prompt,
      userId: session.user.id,
    }
  })

  res.status(200).json(response.data)
}

export default generate