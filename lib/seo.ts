const SITE_URL = 'https://linghao.io'

function toAbsoluteUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return new URL(url, SITE_URL).toString()
}

function getImageType(url: string) {
  const cleanUrl = url.split('?')[0].toLowerCase()
  if (cleanUrl.endsWith('.png')) return 'image/png'
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg'
  if (cleanUrl.endsWith('.webp')) return 'image/webp'
  if (cleanUrl.endsWith('.gif')) return 'image/gif'
  return undefined
}

export function resolveSocialImage(image?: string) {
  if (!image) return undefined

  const url = toAbsoluteUrl(image)
  return {
    url,
    secureUrl: url,
    type: getImageType(url),
    alt: 'Social card image',
  }
}
