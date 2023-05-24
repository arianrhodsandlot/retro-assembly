import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { game, ui } from '../../../core'

export function StatesList({ onSelect }: { onSelect: (stateId: string) => void }) {
  const [states, setStates] = useState<any[]>()
  const [pending, setPending] = useState(false)

  useEffect(() => {
    ;(async () => {
      const states = await ui.listStates()
      setStates(states.reverse())
    })()
  }, [])

  return (
    <div className={classNames('relative h-full py-20', { 'opacity-90': pending })}>
      <div className='flex max-h-full flex-col overflow-auto pl-20 pr-20'>
        {states?.map((state) => (
          <button
            className='mt-10 flex max-w-2xl flex-shrink-0 items-center overflow-hidden border-2 border-white bg-black/90 first:mt-0 focus:border-2 focus:bg-white focus:text-red-600'
            key={state.id}
            onClick={() => onSelect(state.id)}
            aria-hidden
          >
            <div className='h-40 w-40 overflow-hidden'>
              {state.thumbnailUrl ? (
                <img
                  src={state.thumbnailUrl}
                  alt={`saved state of ${state.name}`}
                  className='block h-40 w-40 transform-gpu bg-[#ffffffe6] object-cover transition-transform'
                />
              ) : (
                <div className='flex h-40 w-40 items-center justify-center'>No Image</div>
              )}
            </div>
            <div className='flex h-40 items-center border-l-2 border-l-white pl-6'>
              Saved at {state.createTime.humanized}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
