import { clsx } from 'clsx'

type DivProps = JSX.IntrinsicElements['div']
type BouncingEllipsisProps = DivProps

export function BouncingEllipsis({ className, ...props }: BouncingEllipsisProps) {
  const text = '...'

  return (
    <div className={clsx('inline-block font-bold', className)} {...props}>
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
