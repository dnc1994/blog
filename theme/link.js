import Link from 'next/link'

import colors from './color'

const A = ({ children, href, prefetch, ...props }) => {
  let external = false

  if (href && (/^(https?:\/\/|\/\/)/.test(href) || /^(mailto:)/.test(href))) {
    external = true
  }

  if (external) {
    return (
      <a href={href} target='_blank' {...props}>
        {children}
        <style jsx>{`
          color: ${colors.main};
          text-decoration: underline;
          text-decoration-color: transparent;
          text-underline-position: from-font;
          cursor: pointer;
          :hover {
            text-decoration-color: currentColor;
          }
        `}</style>
      </a>
    )
  } else {
    return (
      <Link href={href} prefetch={prefetch}>
        <a target={external ? '_blank' : null} {...props}>
          {children}
          <style jsx>{`
            color: ${colors.main};
            text-decoration: underline;
            text-decoration-color: transparent;
            text-underline-position: from-font;
            cursor: pointer;
            :hover {
              text-decoration-color: currentColor;
            }
          `}</style>
        </a>
      </Link>
    )
  }
}

export default {
  a: A,
}
