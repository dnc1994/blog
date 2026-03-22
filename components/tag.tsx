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
    'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-sm',
    'border transition-colors',
    interactive
      ? active
        ? 'bg-rurikon-800 text-rurikon-50 border-rurikon-800'
        : 'bg-rurikon-50 text-rurikon-400 border-rurikon-200 hover:border-rurikon-accent hover:text-rurikon-accent cursor-pointer'
      : href
        ? 'bg-rurikon-50 text-rurikon-400 border-rurikon-200 hover:border-rurikon-accent hover:text-rurikon-accent'
        : 'bg-rurikon-50 text-rurikon-400 border-rurikon-200'
  )

  const content = (
    <>
      <span>{tag}</span>
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
