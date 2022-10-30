export default ({ children, meta = {} }) => (
  <div className={meta.lang ? 'lang-' + meta.lang : ''}>
    {children}
    <style jsx>{`
      div {
        margin: 2rem 0 5rem;
      }
      div :global(p) {
        margin-top: 1.5rem;
        margin-bottom: 0;
      }
      div :global(img) {
        max-width: 100%;
      }

      div :global(li > p) {
        margin-top: 0;
      }

      div :global(li) {
        line-height: 1.7;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }

      :global(ul) {
        padding-left: 1.5em;
        list-style: disc;
      }
      :global(ul > li)::marker {
        color: #aaa;
      }

      :global(code) {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          Liberation Mono, Courier New, monospace;
        opacity: 0.8;
        font-size: 0.9em;
        background: #eaeef2;
        border-radius: 6px;
        padding: 0.2em 0.4em;
      }

      :global(pre) {
        background: #eaeef2;
        border-radius: 10px;
        padding: 1.5em;
        line-height: 1.45;
      }
      :global(pre code) {
        opacity: 1;
        font-size: 0.85em;
        background: none;
      }

      // :global(:target) {
      //   background: #fffa9e;
      // }
      // :global(ul) {
      //   list-style-type: none;
      //   padding: 0;
      // }
      // :global(li) {
      //   padding-left: 1.1875em;
      //   position: relative;
      //   margin-bottom: .25em;
      // }
      // :global(li):before {
      //   content: "•";
      //   position: absolute;
      //   left: .2em;
      // }
    `}</style>
  </div>
)
