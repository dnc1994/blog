import { MDXProvider } from '@mdx-js/tag'

import Head from './helpers/head'
import theme from '../theme'

export default meta => ({ children }) => <MDXProvider components={theme.components}><>
  <Head>
    <title>{meta.title}</title>
  </Head>
  <theme.Container>
    <theme.components.h1>{meta.title}</theme.components.h1>
    <div className='navigation'>
      <div className='meta'><span rel='author'>{meta.author}</span>, <time>{meta.date}</time></div>
      <div className='back'><theme.components.a href='/art'>back</theme.components.a></div>
      <style jsx>{`
        .navigation {
          display: flex;
          justify-content: space-between;
          margin: 3rem 0 1rem;
        }
        .meta {
          color: #999;
        }
      `}</style>
    </div>
    <theme.Content>{children}</theme.Content>
    <theme.Footer/>
  </theme.Container>
</></MDXProvider>
