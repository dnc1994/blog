export default ({ children, ...props }) => (
  <div {...props}>
    {children}
    <script
      async
      src='https://www.googletagmanager.com/gtag/js?id=UA-121702790-3'
    />
    <script
      dangerouslySetInnerHTML={{
        __html:
          "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-121702790-3');",
      }}
    />
    <style jsx>{`
      div {
        margin: auto;
        padding: 4rem 1rem 0;
        max-width: 38rem;
      }

      :global(body) {
        margin: 0;
        font-size: 16px;
        line-height: 1.65;
        word-break: break-word;
        word-wrap: break-word;
        hyphens: auto;
        font-family: 'Inter', 'Helvetica Neue', -apple-system,
          BlinkMacSystemFont, Helvetica, 'Segoe UI', Roboto, Oxygen, Ubuntu,
          Cantarell, 'Fira Sans', 'Droid Sans', 'Microsoft Yahei', sans-serif;
        font-feature-settings: 'liga' 1, 'dlig' 1, 'cpsp' 1;
        font-kerning: auto;
        font-variant: normal;
        font-smoothing: subpixel-antialiased;
        -webkit-font-smoothing: subpixel-antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        background-color: #fcfcfc;
        color: #222;
        letter-spacing: -0.012em;
      }

      :global(h1, h2, h3, h4, h5, h6) {
        letter-spacing: -0.02em;
      }

      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400..700');

      @media all and (max-width: 640px) {
        div {
          padding: 1rem;
        }
      }
    `}</style>
  </div>
)
