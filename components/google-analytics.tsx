'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
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
