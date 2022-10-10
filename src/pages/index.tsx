import { authOptions } from 'api/auth/[...nextauth]'
import { Session, unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import ImageGenerationForm from 'components/imageGeneration/ImageGeneratorForm'
import type { GetServerSideProps, NextPage } from 'next'
import { CanvasContextProvider } from 'src/contexts/CanvasContext'

const Home: NextPage<Session> = () => {
  return (
    <>
      <Head>
          <title>Scrollrack | Dreamer</title>
      </Head>

      <CanvasContextProvider>
        <ImageGenerationForm />
      </CanvasContextProvider>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default Home
