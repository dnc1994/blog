import Link from 'next/link'
import { projects } from './data'

export const metadata = {
  title: 'Projects',
  description: 'A small collection of personal side projects.',
}

export default function ProjectsPage() {
  return (
    <div>
      <p className='text-rurikon-500 mb-8'>
        Selected personal projects and experiments.
      </p>

      <ul className='divide-y divide-rurikon-border'>
        {projects.map((project) => {
          const Logo = project.logo
          return (
            <li key={project.id} className='py-5 sm:py-6'>
              <div className='min-w-0'>
                <div className='flex items-center gap-2.5'>
                  <Logo className='h-6 w-6 shrink-0 opacity-90' />
                  <Link
                    href={project.repoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    draggable={false}
                    className='font-medium text-[1.06rem] leading-6 text-rurikon-600 hover:text-rurikon-800 transition-colors underline decoration-rurikon-200 hover:decoration-rurikon-400 underline-offset-2'
                  >
                    {project.name}
                  </Link>
                </div>

                <div className='mt-1.5'>
                  <p className='text-rurikon-500'>{project.description}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
