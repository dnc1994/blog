import { useEffect } from 'react'

export default function Disqus () {
  useEffect(() => {
    let node
    try {
      // load disqus when the component is mounted
      window.disqus_config = function () {
        this.page.url = window.location.href  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = window.location.pathname // Replace PAGE_IDENTIFIER with your page's unique identifier variable
      }
      const d = document, s = d.createElement('script')
      s.src = 'https://linghao-io.disqus.com/embed.js'
      s.setAttribute('data-timestamp', +new Date())
      (d.head || d.body).appendChild(s)
      node = s
    } catch (err) {
      // ignore
    }
    
    return () => {
      if (node) node.remove()
    }
  }, [])

  return (
    <div id="disqus_thread" style={{
      marginBottom: 100
    }}/>
  )
}
