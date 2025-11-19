'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    // @ts-ignore
    window.gtag('config', GA_MEASUREMENT_ID as string, {
      page_path: url,
    })
  }
}

export const GoogleAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && GA_MEASUREMENT_ID) {
      const url = pathname + '?' + searchParams.toString()
      pageview(url)
    }
  }, [pathname, searchParams])

  if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Temporary debug indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
          borderRadius: '50%',
          zIndex: 9999,
        }}
        title={`GA Active: ${GA_MEASUREMENT_ID}`}
      />
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id='google-analytics'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // @ts-ignore
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
