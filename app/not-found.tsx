import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p className='mt-7'>
        The page you're looking for doesn't exist.
      </p>
      <p className='mt-7'>
        <Link href='/' className='underline decoration-rurikon-300 hover:decoration-rurikon-600'>
          Return home
        </Link>
      </p>
    </div>
  )
}

