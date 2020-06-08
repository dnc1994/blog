import { useEffect } from 'react'

export default function Disqus () {
  useEffect(() => {
    try {
      // load disqus when the component is mounted
      window['DISQUS'].host._loadEmbed()
    } catch (err) {
      // ignore
    }
  }, [])

  return <>
    <div id="disqus_thread" style={{
      marginBottom: 100
    }}/>
    <script dangerouslySetInnerHTML={{
      __html: `
        var disqus_config = function () {
          this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
          this.page.identifier = window.location.pathname; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        (function() { // DON'T EDIT BELOW THIS LINE
          var d = document, s = d.createElement('script');
          s.src = 'https://linghao-io.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
        })();
      `
    }}/>
    <noscript>
      Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
    </noscript>
  </>
}
