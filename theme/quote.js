const Blockquote = ({ children }) => (
  <blockquote>
    {children}
    <style jsx>{`
      color: #888;
      font-style: italic;
      margin: 2rem 0;
      padding-left: 1.25rem;
      border-left: 0.25rem solid #eee;
    `}</style>
  </blockquote>
)

export default {
  blockquote: Blockquote,
}
