import Link from 'next/link'

const A = ({ children, href, ...props }) => {
  return (
    <Link href={href}>
      <a {...props}>
        {children}
        <style jsx>{`
          display: inline-block;
          margin-right: 1rem;
          font-size: 1.1rem;
          color: #111;
          text-decoration: none;
        `}</style>
      </a>
    </Link>
  )
}

const P = ({ children }) => {
  return (
    <p>
      {children}
      <style jsx>{`
        p {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem !important;
        }
        p :global(a) {
          transition: opacity 0.2s ease;
        }
        p :global(a:hover) {
          opacity: 0.6;
        }
        p :global(time) {
          display: inline-block;
          margin-bottom: 10px;
          font-size: 0.9rem;
          color: #999;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.04em;
        }
        @media all and (max-width: 640px) {
          p {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </p>
  )
}

export default {
  a: A,
  p: P,
}
