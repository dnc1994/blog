import { MDXProvider } from '@mdx-js/tag'

import Head from './helpers/head'
import theme from '../theme'

export default meta => ({ children }) => <MDXProvider components={theme.components}><>
  <Head>
    <title>Synthesist in the Shell</title>
    <meta property="og:description" content={meta.description} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Synthesist in the Shell | Blog by Linghao Zhang" />
    <meta name="twitter:description" content={meta.description} />    
  </Head>
  <theme.Container>
    <theme.components.h1>Synthesist in the Shell</theme.components.h1>
    <theme.Nav url={meta.url}/>
    <theme.Content>{children}</theme.Content>
    <theme.Footer/>
  </theme.Container>
</></MDXProvider>
