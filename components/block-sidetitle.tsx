import cn from 'clsx'

export function BlockSideTitle({
  title,
  children,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <figure>
      <span className='inline-block w-full'>
        <span className='sidenote-content float-left w-full'>{children}</span>
      </span>
      <span
        className={cn(
          'sidenote block relative mt-3.5 mb-7 mx-auto text-left text-pretty w-[80%] text-xs sm:text-sm leading-5 sm:leading-6 text-rurikon-400',
          'text:inline text:float-right text:clear-right text:w-[50%] text:-mr-[50%] text:mt-0 text:pl-7'
        )}
      >
        <span className='sr-only'>Sidenote: </span>
        {title}
      </span>
    </figure>
  )
}

