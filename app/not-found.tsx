import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h1 className='text-2xl font-semibold mb-7 text-rurikon-600 text-balance'>
        404 - Page Not Found
      </h1>
      <p className='mt-7'>
        The page you're looking for doesn't exist.
      </p>
      <p className='mt-7'>
        <Link
          href='/'
          className='break-words decoration-from-font underline underline-offset-2 decoration-rurikon-300 hover:decoration-rurikon-600 focus:outline-none focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-opacity-50 focus-visible:ring-offset-2'
        >
          Return home
        </Link>
      </p>
    </div>
  )
}
