import Head from 'next/head'

export default ({ children }) => <Head>
  {children}
  <meta charSet="utf-8"/>
  <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta property="og:site_name" content="Synthesist in the Shell | Blog by Linghao Zhang" />
  <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
  <link rel="manifest" href="/static/site.webmanifest" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#ffffff" />
</Head>
