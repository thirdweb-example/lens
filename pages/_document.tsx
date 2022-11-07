import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

export default class _document extends NextDocument {
  render() {
    return (
        <Html lang='en' data-theme="dark">
          <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
          </Head>
          <body className='bg-base-100 font-sf-rounded'>
            <Main />
            <NextScript />
          </body>
        </Html>
    )
  }
}
