import { clsx } from 'clsx'
import { forwardRef } from 'react'

export const StateItem = forwardRef<HTMLButtonElement, { state: any; onSelect: (stateId: string) => void }>(
  function StateItem({ state, onSelect }, ref) {
    return (
      <button
        className={clsx(
          'group mt-10 flex max-w-2xl flex-shrink-0 items-center overflow-hidden rounded border-4 border-white bg-black/90 first:mt-0',
          'focus:animate-[pulse-white-border_1.5s_ease-in-out_infinite] focus:text-red-600'
        )}
        onClick={() => onSelect(state.id)}
        ref={ref}
      >
        <div className='h-40 w-40 overflow-hidden'>
          {state.thumbnailUrl ? (
            <img
              alt={`the thumnail of the state saved at ${state.createTime.humanized}`}
              className='block h-40 w-40 transform-gpu bg-gray-300 object-cover text-transparent transition-transform'
              src={state.thumbnailUrl}
            />
          ) : (
            <div className='flex h-40 w-40 items-center justify-center bg-gray-600 '>
              <span className='icon-[mdi--image-broken-variant] h-12 w-12 text-white' />
            </div>
          )}
        </div>
        <div className={clsx('flex h-40 flex-1 items-center border-l-4 border-l-white pl-6', 'group-focus:bg-white')}>
          Saved at {state.createTime.humanized}
        </div>
      </button>
    )
  }
)
