import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='py-10'>
      <p className='font-mono text-xs sm:text-[13px] tracking-[0.24em] text-rurikon-signal'>
        SIGSEGV · ADDRESS NOT MAPPED
      </p>
      <h1 className='glitch mt-4 font-display font-bold text-7xl sm:text-8xl tracking-[-0.04em] text-rurikon-600'>
        404
      </h1>
      <pre className='mt-8 text-sm text-rurikon-400 whitespace-pre-wrap'>
        {`Segmentation fault (core dumped)
> the page you're looking for was never written,
> or it was garbage-collected.`}
      </pre>
      <p className='mt-8 font-mono text-sm'>
        <Link href='/' className='text-rurikon-accent hover:text-rurikon-800 transition-colors'>
          cd ~ →
        </Link>
        <span className='mx-3 text-rurikon-200'>·</span>
        <Link href='/posts' className='text-rurikon-accent hover:text-rurikon-800 transition-colors'>
          dump all posts →
        </Link>
      </p>
    </div>
  )
}
