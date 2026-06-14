import type { Metadata } from 'next'
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
            <Link key={`${link.href}-${nextParts.length}`} href={link.href}>
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

export default function ResumePage() {
  return (
    <div className='resumeStandalone' aria-label='Linghao Zhang resume'>
      <style>{`
        body:has(.resumeStandalone) {
          padding: 0 !important;
        }

        body:has(.resumeStandalone) nav,
        body:has(.resumeStandalone) > .fixed {
          display: none !important;
        }

        .resumeStandalone {
          position: fixed;
          inset: 0;
          z-index: 100;
          overflow: auto;
          background: #f5f4ed;
          color: #141413;
          font-family: Charter, "Bitstream Charter", "Iowan Old Style", Georgia, Palatino, "Times New Roman", serif;
          font-size: 9.1pt;
          line-height: 1.34;
          letter-spacing: 0;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          --parchment: #f5f4ed;
          --ivory: #faf9f5;
          --ink: #141413;
          --warm-ink: #3d3d3a;
          --olive: #504e49;
          --muted: #6b6a64;
          --rule: #e3e0d5;
          --rule-strong: #d8d4c8;
          --brand: #1b365d;
          --brand-tint: #eef2f7;
          --mono: "SF Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;
        }

        .resumeStandalone * { box-sizing: border-box; margin: 0; padding: 0; }
        .resumeStandalone a { color: var(--brand); text-decoration: none; }
        .resumeStandalone a:hover { text-decoration: underline; }

        .resumeSheet {
          max-width: 210mm;
          min-height: 297mm;
          margin: 14px auto;
          padding: 10mm 12mm;
          background: var(--parchment);
          box-shadow: 0 20px 60px rgba(42, 39, 25, 0.13);
          border: 1px solid rgba(216, 212, 200, 0.8);
        }

        .resumeHeader {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12mm;
          align-items: end;
          padding-bottom: 2.4mm;
          border-bottom: 0.7pt solid var(--rule-strong);
          margin-bottom: 3.2mm;
        }

        .resumeName {
          font-size: 24pt;
          font-weight: 500;
          letter-spacing: -0.35pt;
          line-height: 0.95;
          color: var(--ink);
        }

        .resumeTitle {
          margin-top: 1.4mm;
          color: var(--brand);
          font-size: 10.2pt;
          font-weight: 500;
        }

        .resumeContact {
          text-align: right;
          color: var(--muted);
          font-size: 8.7pt;
          line-height: 1.42;
          white-space: nowrap;
          font-style: normal;
        }

        .resumeContact .sep { color: var(--rule-strong); padding: 0 0.5mm; }

        .resumeMetrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          column-gap: 5mm;
          margin-bottom: 2.9mm;
        }

        .resumeMetric {
          border-bottom: 0.35pt dotted var(--rule-strong);
          padding-bottom: 1.4mm;
        }

        .resumeMetricValue {
          display: block;
          font-size: 12.7pt;
          line-height: 1;
          font-weight: 500;
          color: var(--brand);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .resumeMetricLabel {
          display: block;
          margin-top: 0.8mm;
          color: var(--olive);
          font-size: 8.35pt;
          line-height: 1.15;
          white-space: nowrap;
        }

        .resumeSection {
          display: grid;
          grid-template-columns: 24mm 1fr;
          column-gap: 5mm;
          margin-top: 3.3mm;
        }

        .resumeSection:first-of-type { margin-top: 0; }

        .resumeSectionLabel {
          color: var(--brand);
          font-size: 9pt;
          font-weight: 500;
          letter-spacing: 0.85pt;
          text-transform: uppercase;
          padding-top: 0.6mm;
        }

        .resumeSectionBody {
          border-top: 0.55pt solid var(--rule);
          padding-top: 1.8mm;
          min-width: 0;
        }

        .resumeSummary {
          font-size: 9.3pt;
          line-height: 1.42;
          color: var(--warm-ink);
        }

        .resumeSummary strong,
        .resumeHl { color: var(--brand); font-weight: 500; }

        .resumeRoleBlock {
          padding: 0 0 2mm 0;
          break-inside: avoid;
        }

        .resumeRoleBlock + .resumeRoleBlock {
          padding-top: 2.1mm;
          border-top: 0.35pt dotted var(--rule);
        }

        .resumeRoleHead {
          display: grid;
          grid-template-columns: 1fr auto;
          column-gap: 4mm;
          align-items: baseline;
          margin-bottom: 1mm;
        }

        .resumeCompanyLine {
          min-width: 0;
          font-size: 10.4pt;
          line-height: 1.2;
        }

        .resumeCompany {
          font-weight: 600;
          color: var(--ink);
        }

        .resumeRole {
          color: var(--olive);
          font-style: italic;
        }

        .resumeDate {
          color: var(--muted);
          font-size: 8.8pt;
          line-height: 1.2;
          font-style: italic;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }

        .resumeBullets {
          list-style: none;
        }

        .resumeBullets li {
          position: relative;
          padding-left: 3.5mm;
          margin: 0.95mm 0;
          color: var(--warm-ink);
          line-height: 1.34;
        }

        .resumeBullets li::before {
          content: "";
          position: absolute;
          left: 0.5mm;
          top: 0.55em;
          width: 1.25mm;
          height: 1.25mm;
          border-radius: 50%;
          background: var(--brand);
          opacity: 0.9;
        }

        .resumeBullets strong {
          color: var(--ink);
          font-weight: 600;
        }

        .resumeCompactRole .resumeBullets li { margin: 0.5mm 0; }

        .resumeEduItem {
          display: grid;
          grid-template-columns: 1fr auto;
          column-gap: 4mm;
          padding: 0.9mm 0;
          break-inside: avoid;
        }

        .resumeEduItem + .resumeEduItem {
          border-top: 0.35pt dotted var(--rule);
          padding-top: 1.5mm;
          margin-top: 0.8mm;
        }

        .resumeSchool { font-size: 10.2pt; font-weight: 600; color: var(--ink); }
        .resumeDegree { color: var(--warm-ink); margin-top: 0.5mm; }
        .resumeCoursework { color: var(--muted); margin-top: 0.4mm; }

        .resumeSkills { display: grid; row-gap: 1mm; }

        .resumeSkillRow {
          display: grid;
          grid-template-columns: 21mm 1fr;
          gap: 3mm;
          padding: 0.4mm 0;
        }

        .resumeSkillLabel {
          color: var(--brand);
          font-size: 8.7pt;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.45pt;
        }

        .resumeSkillText { color: var(--warm-ink); }

        @media (max-width: 720px) {
          .resumeSheet { min-height: auto; margin: 0; padding: 18px; border: none; box-shadow: none; }
          .resumeHeader { grid-template-columns: 1fr; gap: 8px; }
          .resumeContact { text-align: left; white-space: normal; }
          .resumeMetrics { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 10px; }
          .resumeSection { grid-template-columns: 1fr; gap: 5px; }
          .resumeSectionBody { padding-top: 8px; }
          .resumeRoleHead, .resumeEduItem { grid-template-columns: 1fr; row-gap: 3px; }
          .resumeSkillRow { grid-template-columns: 1fr; gap: 2px; }
        }

        @media print {
          @page { size: A4; margin: 10mm 12mm 10mm 12mm; background: #f5f4ed; }
          .resumeStandalone {
            position: static;
            overflow: visible;
            background: #f5f4ed;
          }
          .resumeSheet {
            width: auto;
            min-height: auto;
            padding: 0;
            margin: 0;
            box-shadow: none;
            border: none;
          }
        }
      `}</style>

      <main className='resumeSheet'>
        <header className='resumeHeader'>
          <div>
            <h1 className='resumeName'>{resume.name}</h1>
            <div className='resumeTitle'>{resume.title}</div>
          </div>
          <address className='resumeContact' aria-label='Contact information'>
            <Link href={`mailto:${resume.contact.email}`}>{resume.contact.email}</Link>
            <span className='sep'>·</span>
            <span>{resume.contact.phone}</span>
            <br />
            <Link href={resume.contact.blogUrl}>{resume.contact.blog}</Link>
            <span className='sep'>·</span>
            <span>{resume.contact.organization}</span>
          </address>
        </header>

        <div className='resumeMetrics' aria-label='Career highlights'>
          {resume.metrics.map((metric) => (
            <div className='resumeMetric' key={metric.label}>
              <span className='resumeMetricValue'>{metric.value}</span>
              <span className='resumeMetricLabel'>{metric.label}</span>
            </div>
          ))}
        </div>

        <section className='resumeSection' aria-labelledby='resume-summary-title'>
          <div className='resumeSectionLabel' id='resume-summary-title'>Summary</div>
          <div className='resumeSectionBody'>
            <p className='resumeSummary'>{resume.summary}</p>
          </div>
        </section>

        <section className='resumeSection' aria-labelledby='resume-experience-title'>
          <div className='resumeSectionLabel' id='resume-experience-title'>Experience</div>
          <div className='resumeSectionBody'>
            {resume.experience.map((job) => (
              <article
                className={`resumeRoleBlock ${job.bullets.length === 1 ? 'resumeCompactRole' : ''}`}
                key={`${job.company}-${job.dates}`}
              >
                <div className='resumeRoleHead'>
                  <div className='resumeCompanyLine'>
                    <span className='resumeCompany'>{job.company}</span>,{' '}
                    <span className='resumeRole'>{job.role}</span>
                  </div>
                  <div className='resumeDate'>{job.dates}</div>
                </div>
                <ul className='resumeBullets'>
                  {job.bullets.map((bullet) => (
                    <li key={`${job.company}-${bullet.lead || bullet.text}`}>
                      {bullet.lead ? <strong>{bullet.lead}: </strong> : null}
                      {linkifyText(bullet.text, bullet.links)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className='resumeSection' aria-labelledby='resume-education-title'>
          <div className='resumeSectionLabel' id='resume-education-title'>Education</div>
          <div className='resumeSectionBody'>
            {resume.education.map((edu) => (
              <div className='resumeEduItem' key={edu.school}>
                <div>
                  <div className='resumeSchool'>{edu.school}</div>
                  {edu.details.map((detail, index) => (
                    <div className={index === 0 ? 'resumeDegree' : 'resumeCoursework'} key={detail}>
                      {detail}
                    </div>
                  ))}
                </div>
                <div className='resumeDate'>{edu.dates}</div>
              </div>
            ))}
          </div>
        </section>

        <section className='resumeSection' aria-labelledby='resume-skills-title'>
          <div className='resumeSectionLabel' id='resume-skills-title'>Skills</div>
          <div className='resumeSectionBody resumeSkills'>
            {resume.skills.map((skill) => (
              <div className='resumeSkillRow' key={skill.label}>
                <div className='resumeSkillLabel'>{skill.label}</div>
                <div className='resumeSkillText'>{skill.items.join(', ')}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
