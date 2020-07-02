export default ({ children, ...props }) => (
  <div {...props}>
    {children}
    <script async src='https://www.googletagmanager.com/gtag/js?id=UA-121702790-3'/>
    <script dangerouslySetInnerHTML={{ __html: "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-121702790-3');" }} />
    <style jsx>{`
      div {
        margin: auto;
        padding: 4rem 1rem 0;
        max-width: 38rem;
      }

      :global(body) {
        margin: 0;
        color: black;
        font-size: 16px;
        line-height: 1.65;
        word-break: break-word;
        word-wrap: break-word;
        hyphens: auto;
        font-family: 'Roboto', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, Helvetica, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Microsoft Yahei', sans-serif;
        font-feature-settings: 'liga' 1, 'dlig' 1, 'lnum' 1, 'ordn' 1, 'halt' 1, 'kern' 1, 'kern', 'mgrk';
        font-kerning: auto;
        font-variant: normal;
        font-smoothing: antialiased;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        background-color: white;
      }
      
      @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap');

      @media all and (max-width: 640px) {
        div {
          padding: 1rem;
        }
      }
    `}</style>
  </div>
)
