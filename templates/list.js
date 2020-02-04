import { MDXProvider } from '@mdx-js/tag'

import Head from './helpers/head'
import theme from '../theme'

export default meta => ({ children }) => <MDXProvider components={{
  ...theme.components,
  ...theme.TemplateList,
}}><>
  <Head>
    <title>Synthesist in the Shell | {meta.title}</title>
  </Head>
  <theme.Container>
    <theme.components.h1>{meta.title}</theme.components.h1>
    <theme.Nav url={meta.url}/>
    <theme.Content>{children}</theme.Content>
    <theme.Footer/>
    <style jsx>{`
      :global(small) {
        color: #999;
      }
    `}</style>
  </theme.Container>
</></MDXProvider>
