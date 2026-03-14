import Link from 'next/link'
import { tools } from './data'

export const metadata = {
  title: 'Agentic Coding',
  description: 'Tools I have bookmarked for agentic coding workflows.',
}

export default function AgenticCodingPage() {
  return (
    <div>
      <Link
        href='/lists'
        className='inline-block mb-6 text-sm text-rurikon-400 hover:text-rurikon-600 transition-colors'
      >
        ← Lists
      </Link>

      <p className='text-rurikon-500 mb-8'>
        Tools I&apos;ve bookmarked for agentic coding workflows.
      </p>

      <ul className='divide-y divide-rurikon-border'>
        {tools.map((tool) => (
          <li key={tool.id} className='py-4 sm:py-5'>
            <div className='min-w-0'>
              <Link
                href={tool.url}
                target='_blank'
                rel='noopener noreferrer'
                draggable={false}
                className='font-medium text-rurikon-600 hover:text-rurikon-800 transition-colors underline decoration-rurikon-200 hover:decoration-rurikon-400 underline-offset-2'
              >
                {tool.name}
              </Link>
              <p className='mt-1 text-rurikon-400'>{tool.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
