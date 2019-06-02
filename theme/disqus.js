export default function Disqus () {
  return <>
    <div id="disqus_thread" style={{
      marginBottom: 100
    }}/>
    <script dangerouslySetInnerHTML={{
      __html: `
        var disqus_config = function () {
          this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
          this.page.identifier = window.next.route.pathname; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        (function() { // DON'T EDIT BELOW THIS LINE
          var d = document, s = d.createElement('script');
          s.src = 'https://linghao-io.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
          console.log('???')
        })();
      `
    }}/>
    <noscript>
      Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
    </noscript>
  </>
}