const H1 = ({ children, id, ...props }) => <h1 id={id} {...props}>
  {children}
  <style jsx>{`
    h1 {
      font-size: 1.5em;
      font-weight: 600;
    }
  `}</style>
</h1>

const H2 = ({ children, id }) => <h2 id={id}>
  <a href={'#' + id}>{children}</a>
  <style jsx>{`
    h2 {
      margin-top: 2.5rem;
      font-size: 1.3em;
      font-weight: 600;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
  `}</style>
</h2>

const H3 = ({ children, id }) => <h3 id={id}>
  <a href={'#' + id}>{children}</a>
  <style jsx>{`
    h3 {
      font-size: 1.1em;
      margin-top: 2.5rem;
      font-weight: 400;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
  `}</style>
</h3>

export default {
  h1: H1, 
  h2: H2,
  h3: H3
}
