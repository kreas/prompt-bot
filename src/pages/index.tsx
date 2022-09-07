import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import ImageGenerationForm from 'components/imageGeneration/ImageGeneratorForm'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { data: session } = useSession()

  // TODO: this really should be a websocket
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <>
      <Head>
        <title>Scrollrack</title>
        <meta name="description" content="AI powered asset generator for Magic The Gathering" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta property="og:title" content="AI powered asset generator for Magic the Gathering" />
        <meta property="og:description" content="Create unique tokens, playmats, and more," />
        <meta
          property="og:image"
          content="https://www.scrollrack.quest/og-image.jpg"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session ? (
        <ImageGenerationForm />
      ) : (
        <div>
          <button onClick={() => signIn()} className="btn btn-primary">
            Sign-in
          </button>
        </div>
      )}
    </>
  )
}

export default Home
