// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'
import { exampleRouter } from './example'
import { protectedExampleRouter } from './protected-example-router'
import galleryRouter from './gallery'
import dreamRouter from './dreams'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('auth.', protectedExampleRouter)
  .merge('gallery.', galleryRouter)
  .merge('dreams.', dreamRouter)

// export type definition of API
export type AppRouter = typeof appRouter
