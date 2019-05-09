import { MDXProvider } from '@mdx-js/tag'

import Head from './helpers/head'
import theme from '../theme'

export default meta => ({ children }) => <MDXProvider components={theme.components}><>
  <Head>
    <title>{meta.title}</title>
  </Head>
  <theme.Container itemScope itemType='http://schema.org/blogPost'>
    <theme.components.h1 itemType='headline'>{meta.title}</theme.components.h1>
    <div className='navigation'>
      <div className='meta'><span rel='author' itemType='author'>{meta.author}</span>, <time itemType='datePublished'>{meta.date}</time></div>
      <div className='back'><theme.components.a href='/blog'>back</theme.components.a></div>
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
    <theme.Content meta={meta}>{children}</theme.Content>
    <theme.Footer/>
  </theme.Container>
</></MDXProvider>
