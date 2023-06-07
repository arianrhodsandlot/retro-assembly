import { clsx } from 'clsx'
import { useAsync } from 'react-use'
import { ui } from '../../../core'

export function StatesList({ onSelect }: { onSelect: (stateId: string) => void }) {
  const state = useAsync(async () => {
    const states = await ui.listStates()
    return states.reverse()
  })

  return (
    <div className={clsx('relative h-full py-20')}>
      {state.loading ? (
        <div className='flex h-full max-w-2xl items-center justify-center overflow-auto pl-20 pr-20'>
          <span className='icon-[line-md--loading-loop] h-12 w-12 text-white' />
        </div>
      ) : state?.value?.length ? (
        <div className='flex max-h-full flex-col overflow-auto pl-20 pr-20'>
          {state?.value?.map((state) => (
            <button
              aria-hidden
              className='mt-10 flex max-w-2xl flex-shrink-0 items-center overflow-hidden border-2 border-white bg-black/90 first:mt-0 focus:border-2 focus:bg-white focus:text-red-600'
              key={state.id}
              onClick={() => onSelect(state.id)}
            >
              <div className='h-40 w-40 overflow-hidden'>
                {state.thumbnailUrl ? (
                  <img
                    alt={`saved state of ${state.name}`}
                    className='block h-40 w-40 transform-gpu bg-gray-300 object-cover transition-transform'
                    src={state.thumbnailUrl}
                  />
                ) : (
                  <div className='flex h-40 w-40 items-center justify-center bg-gray-600'>
                    <span className='icon-[mdi--image-broken-variant] h-12 w-12 text-white' />
                  </div>
                )}
              </div>
              <div className='flex h-40 items-center border-l-2 border-l-white pl-6'>
                Saved at {state.createTime.humanized}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className='flex h-full items-center pl-20 opacity-60'>
          <div className='flex items-center text-xl'>
            <span className='icon-[mdi--file-hidden] mr-2 h-6 w-6' />
            There are no saved states for current game.
          </div>
        </div>
      )}
    </div>
  )
}
