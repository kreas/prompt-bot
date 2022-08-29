import type { NextPage } from 'next'
import Head from 'next/head'
import { trpc } from '../utils/trpc'

type TechnologyCardProps = {
  name: string
  description: string
  documentation: string
}

const Home: NextPage = () => {
  const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }])

  return (
    <>
      <Head>
        <title>Prompt Bot</title>
        <meta name="description" content="Prompt Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4"></main>
    </>
  )
}

export default Home
