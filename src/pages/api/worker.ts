import { NextApiRequest, NextApiResponse } from "next"
import Redis from 'ioredis'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
  await client.rpush('dreams', JSON.stringify(req.body))
  const value = await client.lpop('dreams')

  res.status(201).json({ message: value })
}

export default handler
