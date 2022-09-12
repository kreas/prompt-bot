import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <meta name="description" content="AI powered asset generator for Magic The Gathering" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta property="og:title" content="AI powered asset generator for Magic the Gathering" />
        <meta property="og:description" content="Create unique tokens, playmats, and more," />
        <meta property="og:image" content="https://www.scrollrack.quest/og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script defer data-domain="scrollrack.quest" src="https://plausible.io/js/plausible.js"></script>
      </body>
    </Html>
  )
}
