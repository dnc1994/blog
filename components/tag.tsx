import Link from 'next/link'
import cn from 'clsx'

type TagProps = {
  tag: string
  active?: boolean
  count?: number
  interactive?: boolean
  href?: string
}

export function Tag({ tag, active = false, count, interactive = false, href }: TagProps) {
  const className = cn(
    'inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-xs',
    'border transition-colors',
    interactive
      ? active
        ? 'bg-rurikon-accent text-[var(--background)] border-rurikon-accent'
        : 'text-rurikon-400 border-rurikon-200 hover:border-rurikon-accent hover:text-rurikon-accent cursor-pointer'
      : href
        ? 'text-rurikon-400 border-rurikon-200 hover:border-rurikon-accent hover:text-rurikon-accent'
        : 'text-rurikon-400 border-rurikon-200'
  )

  const content = (
    <>
      <span>#{tag}</span>
      {count !== undefined && (
        <span className={cn(
          'tabular-nums',
          active ? 'text-rurikon-50/80' : 'text-rurikon-300'
        )}>
          {count}
        </span>
      )}
    </>
  )

  if (href && !interactive) {
    return (
      <Link href={href} className={className} draggable={false}>
        {content}
      </Link>
    )
  }

  return <span className={className}>{content}</span>
}
