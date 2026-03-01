import type { SVGProps } from 'react'

type LogoProps = SVGProps<SVGSVGElement>

export function PostSummarizerBotLogo(props: LogoProps) {
  return (
    <svg viewBox='0 0 64 64' fill='none' aria-hidden='true' {...props}>
      <rect x='1.5' y='1.5' width='61' height='61' rx='14' className='fill-rurikon-50 stroke-rurikon-200' />
      <rect x='13' y='15' width='26' height='4' rx='2' className='fill-rurikon-400' />
      <rect x='13' y='24' width='38' height='4' rx='2' className='fill-rurikon-300' />
      <rect x='13' y='33' width='34' height='4' rx='2' className='fill-rurikon-300' />
      <rect x='13' y='42' width='20' height='4' rx='2' className='fill-rurikon-300' />
      <circle cx='47' cy='46' r='8.5' className='fill-rurikon-700' />
      <path d='M44 46.5L46.2 48.8L50.3 44.7' className='stroke-white' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

export function BwCalendarLogo(props: LogoProps) {
  return (
    <svg viewBox='0 0 64 64' fill='none' aria-hidden='true' {...props}>
      <rect x='1.5' y='1.5' width='61' height='61' rx='14' className='fill-rurikon-50 stroke-rurikon-200' />
      <rect x='12' y='16' width='40' height='34' rx='6' className='fill-white stroke-rurikon-300' />
      <rect x='12' y='16' width='40' height='10' rx='6' className='fill-rurikon-200' />
      <path d='M21 13V20M43 13V20' className='stroke-rurikon-500' strokeWidth='2.6' strokeLinecap='round' />
      <rect x='18' y='31' width='10' height='7' rx='2' className='fill-rurikon-700' />
      <rect x='31' y='31' width='6' height='7' rx='2' className='fill-rurikon-300' />
      <rect x='40' y='31' width='6' height='7' rx='2' className='fill-rurikon-300' />
      <rect x='18' y='41' width='6' height='4' rx='1.2' className='fill-rurikon-300' />
      <rect x='27' y='41' width='6' height='4' rx='1.2' className='fill-rurikon-300' />
      <rect x='36' y='41' width='6' height='4' rx='1.2' className='fill-rurikon-300' />
    </svg>
  )
}

export function RedactleZhLogo(props: LogoProps) {
  return (
    <svg viewBox='0 0 64 64' fill='none' aria-hidden='true' {...props}>
      <rect x='1.5' y='1.5' width='61' height='61' rx='14' className='fill-rurikon-50 stroke-rurikon-200' />
      <rect x='12' y='14' width='40' height='36' rx='7' className='fill-white stroke-rurikon-300' />
      <rect x='18' y='21' width='22' height='4' rx='2' className='fill-rurikon-300' />
      <rect x='18' y='29' width='13' height='4' rx='2' className='fill-rurikon-300' />
      <rect x='35' y='29' width='11' height='4' rx='2' className='fill-rurikon-300' />
      <rect x='18' y='37' width='9' height='4' rx='2' className='fill-rurikon-300' />
      <rect x='31' y='37' width='15' height='4' rx='2' className='fill-rurikon-300' />
      <rect x='42' y='21' width='10' height='10' rx='2' className='fill-rurikon-700' />
      <path
        d='M45.1 24.3C45.4 23.8 46 23.5 46.6 23.5C47.6 23.5 48.4 24.3 48.4 25.3C48.4 26.1 47.9 26.7 47.2 27L46.6 27.2V28.1'
        className='stroke-white'
        strokeWidth='1.7'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle cx='46.6' cy='29.8' r='0.9' className='fill-white' />
      <circle cx='49.5' cy='49.5' r='6.8' className='fill-rurikon-700' />
      <path d='M46.7 49.4L48.6 51.3L52.3 47.7' className='stroke-white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}
