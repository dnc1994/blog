import type { Metadata, Viewport } from 'next'

import cn from 'clsx'
import localFont from 'next/font/local'
import 'katex/dist/katex.min.css'

import Navbar from '@/components/navbar'
import SiteFooter from '@/components/site-footer'
import ContentFrame from '@/components/content-frame'
import { ViewTransition } from '@/components/view-transition'
import './globals.css'
const sans = localFont({
  src: './_fonts/InterVariable.woff2',
  preload: true,
  variable: '--sans',
})
const display = localFont({
  src: './_fonts/SpaceGroteskVariable.woff2',
  preload: true,
  variable: '--display',
})
const mono = localFont({
  src: './_fonts/JetBrainsMonoVariable.woff2',
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
    { media: '(prefers-color-scheme: light)', color: '#050707' },
    { media: '(prefers-color-scheme: dark)', color: '#050707' },
  ],
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const noFlashScript = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('theme-dark',t==='dark');document.documentElement.classList.toggle('theme-light',t==='light')}catch(e){}`

  return (
    <html lang='en' className='overflow-x-hidden touch-manipulation' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body
        className={cn(
          sans.variable,
          display.variable,
          mono.variable,
          'w-full min-h-screen px-5 sm:px-8',
          'text-base leading-7 sm:text-[17px] sm:leading-7 md:text-lg md:leading-[1.75]',
          'text-rurikon-500',
          'antialiased'
        )}
      >
        <div className='mx-auto max-w-[1280px] flex flex-col min-h-screen'>
          <Navbar />
          <main className='relative flex-1 pt-10 sm:pt-14 pb-16'>
            <ViewTransition>
              <ContentFrame>{children}</ContentFrame>
            </ViewTransition>
          </main>
          <SiteFooter />
        </div>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="123a4517-a917-4944-83b4-670d2a832ada"></script>
      </body>
    </html>
  )
}
