import NextAuth, { Profile, User, type NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../server/db/client'
import { env } from '../../../env/server.mjs'

const updateUserProfile = async (user: User, profile: Profile & Record<string, unknown>) => {
  try {
    await prisma.user.update({
      where: {
        email: user.email as string
      },
      data: {
        name: profile.user_name as string,
        image: profile.image_url as string,
        email: profile.email,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user, profile }) {
      if (profile) {
        await updateUserProfile(user, profile as Profile & Record<string, unknown>)
      }
      return true
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
}

export default NextAuth(authOptions)
