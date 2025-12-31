export interface Photo {
  id: string
  src: string
  alt: string
  caption?: string
  metadata?: Record<string, string>
}

export interface Photo {
  id: string
  src: string
  alt: string
  caption?: string
  metadata?: Record<string, string>
}

const R2_URL = 'https://r2.linghao.io'
const CAMERA_A7C2 = 'Sony α7C II'

export const photos: Photo[] = [
  {
    id: 'sample-1',
    src: `${R2_URL}/DSC01241.JPG`,
    alt: 'A sample placeholder photo',
    caption: '京都的漂亮早饭',
    metadata: {
      'Location': 'Kyoto, Japan',
      'Date': '2024-10-28',
      'Camera': CAMERA_A7C2,
      'Note': 'I love that the menu is printed as the cafe\'s own newspaper',
    }
  },
  {
    id: 'sample-2',
    src: `${R2_URL}/DSC01285.JPG`,
    alt: 'Another sample photo',
    // caption: 'Another nice shot from the collection.',
    metadata: {
      'Location': 'Kyoto, Japan',
      'Date': '2024-10-29',
      'Camera': CAMERA_A7C2
    }
  },
  {
    id: 'sample-3',
    src: `${R2_URL}/DSC01293.JPG`,
    alt: 'Third sample',
    // caption: 'Another nice shot from the collection.',
    metadata: {
      'Location': 'Kyoto, Japan',
      'Date': '2024-10-29',
      'Camera': CAMERA_A7C2
    }
  },
  {
    id: 'sample-4',
    src: `${R2_URL}/DSC01839.JPG`,
    alt: 'Fourth sample',
    // caption: 'Another nice shot from the collection.',
    metadata: {
      'Location': 'Karatsu, Japan',
      'Date': '2024-11-04',
      'Camera': CAMERA_A7C2
    }    
  }
]
