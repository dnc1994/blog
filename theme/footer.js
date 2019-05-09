const YEAR = (new Date).getFullYear()

export default () => <footer>
  <abbr title='This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License.'>CC BY-NC 4.0</abbr> <time>{YEAR}</time> © Shu Ding.
  <style jsx>{`
    footer {
      margin-bottom: 2rem;
      font-size: .8rem;
      text-align: center;
      color: #999;
    }
    abbr {
      cursor: help;
      text-decoration: none;
      border-bottom: 1px dotted;
    }
  `}</style>
</footer>
