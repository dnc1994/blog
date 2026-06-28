import Link from 'next/link'
import { resources } from './data'

export const metadata = {
  title: 'AI Research',
  description: 'Papers, articles, and resources on AI research worth reading.',
}

export default function AIResearchPage() {
  return (
    <div>
      <Link
        href='/lists'
        className='inline-block mb-6 text-sm text-rurikon-400 hover:text-rurikon-600 transition-colors'
      >
        ← Lists
      </Link>

      <p className='text-rurikon-500 mb-8'>
        Papers, articles, and resources on AI research worth reading.
      </p>

      <ul className='divide-y divide-rurikon-border'>
        {resources.map((resource) => (
          <li key={resource.id} className='py-4 sm:py-5'>
            <div className='min-w-0'>
              <Link
                href={resource.url}
                target='_blank'
                rel='noopener noreferrer'
                draggable={false}
                className='font-medium text-rurikon-600 hover:text-rurikon-accent transition-colors underline decoration-rurikon-200 hover:decoration-rurikon-accent underline-offset-2'
              >
                {resource.name}
              </Link>
              <p className='mt-1 text-rurikon-400'>{resource.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
