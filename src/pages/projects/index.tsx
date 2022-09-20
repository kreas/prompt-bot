import { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { authOptions } from 'api/auth/[...nextauth]'

import Head from 'next/head'
import { useEffect } from 'react'

const Projects: NextPage = () => {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) signIn()
  }, [session])

  return (
    <>
      <Head>
        <title>Prompt Bot</title>
        <meta name="description" content="Prompt Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1>Something wicked this way comes</h1>
      </main>
    </>
  )
}

export default Projects

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await unstable_getServerSession(context.req, context.res, authOptions),
    },
  }
}
