import Redis from "ioredis"

export const initRedisClient = () => {
  return new Redis({
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || undefined,
    db: 0,
  })
}
