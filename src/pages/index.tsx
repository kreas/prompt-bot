import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import ImageGenerationForm from 'components/imageGeneration/ImageGeneratorForm'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { data: session } = useSession()

  return (
    <>
      <Head>
          <title>Scrollrack | Dreamer</title>
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
