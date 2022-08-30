import type { NextPage } from 'next'
import Head from 'next/head'
import BaseLayout from 'components/layout/BaseLayout'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Prompt Bot</title>
        <meta name="description" content="Prompt Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BaseLayout>
        <div className="prose">
          <h1>Hello World</h1>
        </div>
      </BaseLayout>
    </>
  )
}

export default Home
