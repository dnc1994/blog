import Link from 'next/link'
import { tools } from './agentic-coding/data'

export const metadata = {
  title: 'Lists',
  description: 'Things I\'ve curated.',
}

function itemCount(n: number): string {
  return n === 1 ? '1 item' : `${n} items`
}

const lists = [
  {
    slug: 'agentic-coding',
    name: 'Agentic Coding',
    description: 'Tools for agentic coding workflows.',
    count: tools.length,
  },
]

export default function ListsPage() {
  return (
    <div>
      <p className='text-rurikon-500 mb-8'>
        Things I&apos;ve curated.
      </p>

      <ul className='divide-y divide-rurikon-border'>
        {lists.map((list) => (
          <li key={list.slug} className='py-4 sm:py-5'>
            <div className='flex items-baseline justify-between gap-4 min-w-0'>
              <div className='min-w-0'>
                <Link
                  href={`/lists/${list.slug}`}
                  draggable={false}
                  className='font-medium text-rurikon-600 hover:text-rurikon-800 transition-colors underline decoration-rurikon-200 hover:decoration-rurikon-400 underline-offset-2'
                >
                  {list.name}
                </Link>
                <span className='ml-3 text-rurikon-400 text-sm'>{list.description}</span>
              </div>
              <span className='shrink-0 text-rurikon-300 text-sm'>{itemCount(list.count)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
