import { APP_NAME, DEFAULT_OG, DESCRIPTION } from '../../constants'
import Head from 'next/head'

export default function Seo({ title = APP_NAME, description = DESCRIPTION }) {
  return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        <meta property="og:url" content="https://lenstats.xyz" />
        <meta property="og:site_name" content="Lenstats" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={DEFAULT_OG} />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />

        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="Lenstats" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image:src" content={DEFAULT_OG} />
        <meta property="twitter:image:width" content="400" />
        <meta property="twitter:image:height" content="400" />
        <meta property="twitter:creator" content="crypto_adewale" />

        <link
            rel="search"
            type="application/opensearchdescription+xml"
            href="/opensearch.xml"
            title={APP_NAME}
        />
      </Head>
  )
}
