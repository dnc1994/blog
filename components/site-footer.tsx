import Link from 'next/link'

const links = [
  { label: 'Telegram', href: 'https://t.me/linghao' },
  { label: 'GitHub', href: 'https://github.com/dnc1994' },
  { label: 'RSS', href: '/feed.xml' },
]

export default function SiteFooter() {
  return (
    <footer className='flex flex-wrap justify-between gap-x-6 gap-y-2 py-5 mb-4 border-t border-rurikon-border font-mono text-xs text-rurikon-300'>
      <span>Stay informed. Stay authentic.</span>
      <span className='flex flex-wrap gap-x-4'>
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className='hover:text-rurikon-accent transition-colors'
            {...(l.href.startsWith('https://')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {l.label}
          </Link>
        ))}
        <span aria-hidden='true' className='text-rurikon-ghost'>
          exit 0
        </span>
      </span>
    </footer>
  )
}
