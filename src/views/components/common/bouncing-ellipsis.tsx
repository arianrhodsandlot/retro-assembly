import clsx from 'clsx'

export function BouncingEllipsis() {
  const text = '...'

  return (
    <div className='ml-1 inline-block font-bold'>
      {[...text].map((char, index) => {
        return (
          <span
            className={clsx('inline-block animate-bounce', {
              '[animation-delay:0.33s]': index % 3 === 1,
              '[animation-delay:0.66s]': index % 3 === 2,
            })}
            key={index}
          >
            {char}
          </span>
        )
      })}
    </div>
  )
}
