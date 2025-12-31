import { photos } from './data'
import GalleryGrid from './gallery-grid'

export const metadata = {
  title: 'Gallery',
  description: 'Amateur photography collection.',
}

export default function GalleryPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-12">
        {/* <h1 className="font-serif text-3xl text-rurikon-800 mb-4">Gallery</h1> */}
        <div className="text-rurikon-500 max-w-xl">
          A collection of amateur photography.
        </div>
      </div>
      
      <GalleryGrid photos={photos} />
    </div>
  )
}
