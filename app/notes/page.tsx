import Link from 'next/link'
import { LEGACY_NOTE_SLUGS } from '@/lib/legacy-notes'

export const metadata = {
  title: 'Notes (Moved)',
  description: 'Legacy notes URLs are preserved. New and moved notes now live under /posts.',
}

export default async function Page() {
  const items = []
  for (const slug of LEGACY_NOTE_SLUGS) {
    const module = await import('@/app/posts/_articles/' + `${slug}.mdx`)
    if (!module.metadata) continue

    items.push({
      slug,
      title: module.metadata.title,
      date: module.metadata.date || '-',
      sort: Number(module.metadata.date?.replaceAll('.', '').replaceAll('-', '') || 0),
    })
  }
  items.sort((a, b) => b.sort - a.sort)

  return (
    <div>
      <p className='text-rurikon-400 mb-7'>
        Notes have moved to <Link href='/posts' className='underline decoration-rurikon-300 hover:decoration-rurikon-600'>/posts</Link>. This page is kept for backward compatibility.
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.slug} className='font-medium'>
            <Link
              href={`/posts/${item.slug}`}
              className='group flex gap-1 justify-between items-center'
              draggable={false}
            >
              <span className='block text-rurikon-500 group-hover:text-rurikon-700'>
                {item.title}
              </span>
              <span className='text-sm dot-leaders flex-1 text-rurikon-100 font-normal group-hover:text-rurikon-500 transition-colors group-hover:transition-none leading-none' />
              <time className='block text-rurikon-200 tabular-nums font-normal tracking-tighter group-hover:text-rurikon-500 transition-colors group-hover:transition-none self-start'>
                {item.date}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
