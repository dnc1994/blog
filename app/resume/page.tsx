import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { resume, type ResumeLink } from './source'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Resume for Linghao Zhang, Engineering Leader in Generative AI.',
  alternates: {
    canonical: '/resume',
  },
  openGraph: {
    title: 'Linghao Zhang · Resume',
    description: 'Engineering Leader in Generative AI with full-stack depth across models, infrastructure, and product experiences.',
    url: 'https://linghao.io/resume',
    type: 'profile',
  },
}

function linkifyText(text: string, links: ResumeLink[] = []) {
  if (links.length === 0) return text

  const parts: React.ReactNode[] = [text]

  for (const link of links) {
    const nextParts: React.ReactNode[] = []

    for (const part of parts) {
      if (typeof part !== 'string') {
        nextParts.push(part)
        continue
      }

      const chunks = part.split(link.label)
      chunks.forEach((chunk, index) => {
        if (chunk) nextParts.push(chunk)
        if (index < chunks.length - 1) {
          nextParts.push(
            <Link
              key={`${link.href}-${nextParts.length}`}
              href={link.href}
              className='text-rurikon-accent underline decoration-rurikon-border underline-offset-2 transition-colors hover:text-rurikon-700 hover:decoration-rurikon-accent'
            >
              {link.label}
            </Link>
          )
        }
      })
    }

    parts.splice(0, parts.length, ...nextParts)
  }

  return parts
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className='grid gap-2 border-t border-rurikon-border pt-4 text-[0.95rem] leading-6 mobile:grid-cols-[5.5rem_1fr] mobile:gap-6 print:grid-cols-[5.5rem_1fr] print:gap-6 print:break-inside-avoid'>
      <h2 className='font-mono text-[0.68rem] font-medium uppercase leading-5 tracking-[0.16em] text-rurikon-accent'>
        {title}
      </h2>
      <div className='min-w-0'>{children}</div>
    </section>
  )
}

export default function ResumePage() {
  return (
    <div className='resume-page max-w-none pb-10 print:pb-0'>
      <header className='mb-7 border-b border-rurikon-border pb-5'>
        <div className='flex flex-col gap-4 mobile:flex-row mobile:items-end mobile:justify-between'>
          <div>
            <h1 className='text-[2.15rem] font-semibold leading-none tracking-[-0.04em] text-rurikon-700 sm:text-[2.55rem] print:text-[2rem]'>
              {resume.name}
            </h1>
            <p className='mt-2 text-sm font-medium leading-5 text-rurikon-accent sm:text-base print:text-[0.82rem]'>
              {resume.title}
            </p>
          </div>

          <address className='not-italic text-sm leading-6 text-rurikon-400 mobile:text-right print:text-[0.75rem] print:leading-5'>
            <Link className='text-rurikon-accent hover:text-rurikon-700' href={`mailto:${resume.contact.email}`}>
              {resume.contact.email}
            </Link>
            <span className='px-1.5 text-rurikon-border'>·</span>
            <span>{resume.contact.phone}</span>
            <br />
            <Link className='text-rurikon-accent hover:text-rurikon-700' href={resume.contact.blogUrl}>
              {resume.contact.blog}
            </Link>
            <span className='px-1.5 text-rurikon-border'>·</span>
            <span>{resume.contact.organization}</span>
          </address>
        </div>
      </header>

      <div className='mb-7 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 print:mb-4 print:grid-cols-4 print:gap-x-4'>
        {resume.metrics.map((metric) => (
          <div key={metric.label} className='border-b border-dotted border-rurikon-border pb-2'>
            <div className='text-xl font-medium leading-none tracking-[-0.02em] text-rurikon-accent print:text-base'>
              {metric.value}
            </div>
            <div className='mt-1.5 text-xs leading-4 text-rurikon-400 print:text-[0.68rem] print:leading-3'>
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      <div className='space-y-7 print:space-y-4'>
        <Section title='Summary'>
          <p className='text-rurikon-500 print:text-[0.78rem] print:leading-5'>
            {resume.summary}
          </p>
        </Section>

        <Section title='Experience'>
          <div className='space-y-5 print:space-y-3'>
            {resume.experience.map((job) => (
              <article key={`${job.company}-${job.dates}`} className='break-inside-avoid'>
                <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between'>
                  <h3 className='text-base font-semibold leading-6 text-rurikon-700 print:text-[0.86rem] print:leading-5'>
                    {job.company}
                    <span className='font-normal italic text-rurikon-400'>, {job.role}</span>
                  </h3>
                  <div className='shrink-0 text-sm italic leading-5 text-rurikon-300 print:text-[0.72rem]'>
                    {job.dates}
                  </div>
                </div>

                <ul className='mt-1.5 space-y-1.5 print:mt-1 print:space-y-1'>
                  {job.bullets.map((bullet) => (
                    <li
                      key={`${job.company}-${bullet.lead || bullet.text}`}
                      className='relative pl-4 text-[0.95rem] leading-6 text-rurikon-500 before:absolute before:left-0 before:top-[0.68em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-rurikon-accent print:text-[0.76rem] print:leading-[1.25rem]'
                    >
                      {bullet.lead ? <strong className='font-semibold text-rurikon-700'>{bullet.lead}: </strong> : null}
                      {linkifyText(bullet.text, bullet.links)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section title='Education'>
          <div className='space-y-3 print:space-y-2'>
            {resume.education.map((edu) => (
              <div key={edu.school} className='break-inside-avoid border-b border-dotted border-rurikon-border pb-3 last:border-0 last:pb-0 print:pb-2'>
                <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between'>
                  <h3 className='font-semibold leading-6 text-rurikon-700 print:text-[0.84rem] print:leading-5'>{edu.school}</h3>
                  <div className='shrink-0 text-sm italic text-rurikon-300 print:text-[0.72rem]'>{edu.dates}</div>
                </div>
                {edu.details.map((detail) => (
                  <p key={detail} className='text-sm leading-5 text-rurikon-500 print:text-[0.74rem] print:leading-4'>
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Section>

        <Section title='Skills'>
          <div className='space-y-2 print:space-y-1'>
            {resume.skills.map((skill) => (
              <div key={skill.label} className='grid gap-1 text-sm leading-5 sm:grid-cols-[6.25rem_1fr] sm:gap-4 print:grid-cols-[5.5rem_1fr] print:text-[0.74rem] print:leading-4'>
                <div className='font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-rurikon-accent print:text-[0.62rem]'>
                  {skill.label}
                </div>
                <div className='text-rurikon-500'>{skill.items.join(', ')}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
