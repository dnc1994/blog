import type { Metadata, Viewport } from 'next'

import cn from 'clsx'
import localFont from 'next/font/local'
import 'katex/dist/katex.min.css'

import Navbar from '@/components/navbar'
import { ViewTransition } from '@/components/view-transition'
import './globals.css'
const sans = localFont({
  src: './_fonts/InterVariable.woff2',
  preload: true,
  variable: '--sans',
})
const serif = localFont({
  src: './_fonts/LoraItalicVariable.woff2',
  preload: true,
  variable: '--serif',
})
const mono = localFont({
  src: './_fonts/IosevkaFixedCurly-ExtendedMedium.woff2',
  preload: true,
  variable: '--mono',
})
export const metadata: Metadata = {
  metadataBase: new URL('https://linghao.io'),
  title: {
    template: '%s - Linghao Zhang',
    default: 'Linghao Zhang',
  },
  description: 'A blog by Linghao Zhang.',
  openGraph: {
    title: 'Linghao Zhang',
    description: 'A blog by Linghao Zhang.',
    url: 'https://linghao.io',
    siteName: 'Linghao Zhang',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://linghao.io/icon.png',
        width: 512,
        height: 512,
        alt: 'Linghao Zhang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linghao Zhang',
    description: 'A blog by Linghao Zhang.',
    images: ['https://linghao.io/icon.png'],
  },
}
export const viewport: Viewport = {
  maximumScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFCF0' },
    { media: '(prefers-color-scheme: dark)', color: '#1C1B1A' },
  ],
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const noFlashScript = `try{var t=localStorage.getItem('theme')||'light';document.documentElement.classList.toggle('theme-dark',t==='dark');document.documentElement.classList.toggle('theme-light',t==='light')}catch(e){}`

  return (
    <html lang='en' className='overflow-x-hidden touch-manipulation'>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body
        className={cn(
          sans.variable,
          serif.variable,
          mono.variable,
          'w-full p-6 sm:p-10 md:p-14',
          'text-base leading-7 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7',
          'text-rurikon-500',
          'antialiased'
        )}
      >
        <div className='fixed sm:hidden h-6 w-full top-0 left-0 z-30 pointer-events-none content-fade-out' />
        <div className='flex flex-col mobile:flex-row'>
          <Navbar />
          <main className='relative flex-1 max-w-2xl [contain:inline-size]'>
            <div className='absolute w-full h-px opacity-50 bg-rurikon-border right-0 mobile:right-auto mobile:left-0 mobile:w-px mobile:h-full mobile:opacity-100' />
            <ViewTransition>
              <article className='pl-0 pt-6 mobile:pt-0 mobile:pl-6 sm:pl-10 md:pl-14'>
                {children}
              </article>
            </ViewTransition>
          </main>
        </div>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="123a4517-a917-4944-83b4-670d2a832ada"></script>
      </body>
    </html>
  )
}
