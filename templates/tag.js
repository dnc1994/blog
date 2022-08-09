import { MDXProvider } from '@mdx-js/tag'
import { withRouter } from 'next/router'

import Head from './helpers/head'
import theme from '../theme'

export default meta => withRouter(({ children, router }) => {
  const rootPath = router.pathname.split('/').slice(0, -1).join('/')
  return <MDXProvider components={theme.components, theme.TemplateList}><>
  <Head>
    <title>Synthesist in the Shell | {meta.title}</title>
  </Head>
  <theme.Container>
    <theme.components.h1>{meta.title}</theme.components.h1>
    <div className='navigation'>
      <div className='meta'></div> {/* No author/date info */}
      <div className='back'><theme.components.a href={rootPath ? rootPath : "/"}>BACK</theme.components.a></div>
    </div>
    <theme.Content>{children}</theme.Content>
    <theme.Footer/>
    <style jsx>{`
      :global(small) {
        color: #999;
      }
      .navigation {
        display: flex;
        justify-content: space-between;
        margin: 3rem 0 1rem;
      }
    `}</style>
  </theme.Container>
</></MDXProvider>
})
