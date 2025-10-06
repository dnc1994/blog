'use client'

export function Card({
  image,
  title,
  desc,
  link,
}: {
  image: string
  title: string
  desc: string
  link: string
}) {
  return (
    <a
      href={link}
      target='_blank'
      rel='noreferrer'
      draggable={false}
      className='group block rounded-lg overflow-clip select-none border border-rurikon-border my-7 transition-colors hover:bg-white'
    >
      <img
        src={image}
        className='m-0 w-full aspect-[1.9/1] object-cover border-b border-rurikon-border'
      />
      <p className='m-4 mt-3 mb-1 font-semibold'>{title}</p>
      <p className='m-4 mb-2 mt-1 opacity-80 text-sm'>{desc}</p>
      <p className='m-4 mt-1 mb-3 text-rurikon-200 text-sm transition-colors group-hover:text-rurikon-300'>
        {link}
      </p>
    </a>
  )
}

