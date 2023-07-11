import { clsx } from 'clsx'
import { forwardRef } from 'react'
import { useAsync } from 'react-use'

interface StateItemProps {
  state: any
  onSelect: (stateId: string) => void
}

export const StateItem = forwardRef<HTMLButtonElement, StateItemProps>(function StateItem({ state, onSelect }, ref) {
  const thumbnailUrlState = useAsync(async () => await state.thumbnail?.getUrl())
  return (
    <button
      className={clsx(
        'group mt-10 flex max-w-2xl flex-shrink-0 items-center overflow-hidden rounded border-4 border-white bg-black/90 first:mt-0',
        'focus:animate-[pulse-white-border_1.5s_ease-in-out_infinite] focus:text-rose-700'
      )}
      onClick={() => onSelect(state.id)}
      ref={ref}
    >
      <div className='h-36 w-36 overflow-hidden'>
        {state.thumbnail ? (
          thumbnailUrlState.value ? (
            <img
              alt={`the thumnail of the state saved at ${state.createTime.humanized}`}
              className='block h-36 w-36 transform-gpu bg-gray-300 object-cover text-transparent transition-transform'
              src={thumbnailUrlState.value}
            />
          ) : (
            <div className='flex h-36 w-36 animate-pulse items-center justify-center bg-gray-300' />
          )
        ) : (
          <div className='flex h-36 w-36 items-center justify-center bg-gray-600 '>
            <span className='icon-[mdi--image-broken-variant] h-12 w-12 text-white' />
          </div>
        )}
      </div>
      <div className={clsx('flex h-36 flex-1 items-center border-l-4 border-l-white px-6', 'group-focus:bg-white')}>
        Saved at {state.createTime.humanized}
      </div>
    </button>
  )
})
