// import { env } from './src/env/server.mjs'
import { withSentryConfig } from '@sentry/nextjs'

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return withSentryConfig(config, {
    silent: true,
  })
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  sentry: {
    hideSourceMaps: true,
  },
  images: {
    domains: [
      'cdn.discordapp.com',
      'scrollrack-image-generator.s3.us-east-2.amazonaws.com',
      'dreamstorage.kreas.workers.dev',
      'images.scrollrack.quest'
    ],
  },
})
