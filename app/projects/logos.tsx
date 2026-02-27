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
