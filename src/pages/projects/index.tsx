import { NextPage } from 'next'
import Head from 'next/head'

const Projects: NextPage = () => {
  return (
    <>
      <Head>
        <title>Prompt Bot</title>
        <meta name="description" content="Prompt Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1>Prompt Bot</h1>
      </main>
    </>
  )
}

export default Projects
