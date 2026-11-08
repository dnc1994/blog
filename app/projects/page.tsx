import Link from 'next/link'
import { projects } from './data'

export const metadata = {
  title: 'Projects',
  description: 'A small collection of personal side projects.',
}

export default function ProjectsPage() {
  return (
    <div>
      <p className='font-mono text-xs sm:text-[13px] tracking-[0.24em] text-rurikon-signal'>
        $ PS AUX | GREP PROJECTS
      </p>
      <h1 className='mt-3 font-display font-bold text-5xl sm:text-6xl tracking-[-0.03em] text-rurikon-600'>
        Projects
      </h1>
      <p className='mt-4 mb-8 text-rurikon-400'>
        Selected personal projects and experiments.
      </p>

      <ul className='border-t border-rurikon-border divide-y divide-rurikon-border'>
        {projects.map((project, i) => {
          const Logo = project.logo
          return (
            <li key={project.id} className='py-5 sm:py-6'>
              <div className='min-w-0'>
                <div className='flex items-center gap-2.5'>
                  <span className='font-mono text-xs text-rurikon-signal tabular-nums'>PID {String(i + 1).padStart(3, '0')}</span>
                  <Logo className='h-6 w-6 shrink-0 opacity-90' />
                  <Link
                    href={project.repoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    draggable={false}
                    className='font-display text-xl leading-7 text-rurikon-600 hover:text-rurikon-accent transition-colors'
                  >
                    {project.name}
                  </Link>
                </div>

                <div className='mt-1.5'>
                  <p className='text-rurikon-400'>{project.description}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
