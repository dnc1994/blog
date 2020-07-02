import { useEffect } from 'react'

export default function Disqus () {
  useEffect(() => {
    try {
      // load disqus when the component is mounted
      if (window['DISQUS']) {
        window['DISQUS'].host._loadEmbed()
      } else {
        const d = document, s = d.createElement('script')
        s.src = 'https://linghao-io.disqus.com/embed.js'
        s.setAttribute('data-timestamp', '' + Date.now())
        ;(d.head || d.body).appendChild(s)
      }
    } catch (err) {
      // ignore
    }
  }, [])

  return (
    <div id="disqus_thread" style={{
      marginBottom: 100
    }}/>
  )
}
