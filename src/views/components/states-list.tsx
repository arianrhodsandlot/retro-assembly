import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { game, ui } from '../../core'

export function StatesList() {
  const [states, setStates] = useState<any[]>()
  const [pending, setPending] = useState(false)

  async function loadState(stateId: string) {
    if (pending) {
      return
    }
    setPending(true)

    try {
      await game.loadState(stateId)
    } catch (error) {
      console.warn(error)
    }

    setPending(false)
  }

  useEffect(() => {
    ;(async () => {
      const states = await ui.listStates()
      setStates(states)
    })()
  }, [])

  return (
    <div className={classNames('bg-black/90 text-center', { pending: 'opacity-90' })}>
      <div className='flex'>
        {states?.map((state) => (
          <div
            className='mx-3 overflow-hidden'
            key={state.id}
            role='button'
            onClick={() => loadState(state.id)}
            aria-hidden
          >
            <div className='h-40 w-40 overflow-hidden rounded-lg border-2 border-white'>
              {state.thumbnailUrl ? (
                <img
                  src={state.thumbnailUrl}
                  alt={`saved state of ${state.name}`}
                  className='block h-40 w-40 bg-[#ffffffe6] object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center'>No Image</div>
              )}
            </div>
            {state.createTime.humanized}
          </div>
        ))}
      </div>
    </div>
  )
}
