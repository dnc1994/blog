import Link from 'next/link'
import { tools } from './data'

export const metadata = {
  title: 'Agentic Coding',
  description: 'Tools I have bookmarked for agentic coding workflows.',
}

export default function AgenticCodingPage() {
  return (
    <div>
      <p className='text-rurikon-500 mb-8'>
        Tools I&apos;ve bookmarked for agentic coding workflows.
      </p>

      <ul className='divide-y divide-rurikon-border'>
        {tools.map((tool) => (
          <li key={tool.id} className='py-4 sm:py-5'>
            <div className='flex flex-wrap items-baseline gap-x-2'>
              <Link
                href={tool.url}
                target='_blank'
                rel='noopener noreferrer'
                draggable={false}
                className='font-medium text-rurikon-600 hover:text-rurikon-800 transition-colors underline decoration-rurikon-200 hover:decoration-rurikon-400 underline-offset-2'
              >
                {tool.name}
              </Link>
              <span className='text-rurikon-300'>—</span>
              <span className='text-rurikon-400'>{tool.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
