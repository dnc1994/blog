import Link from 'next/link'
import { getDedupedArticlesFromSection } from '@/lib/articles'

export const metadata = {
  title: 'POSTS',
}

export default async function Page() {
  const items = (await getDedupedArticlesFromSection('posts')).map((item) => ({
    ...item,
    sort: Number(item.date?.replaceAll('.', '').replaceAll('-', '') || 0),
  }))

  items.sort((a, b) => b.sort - a.sort)

  return (
    <div>
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

