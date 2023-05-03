import classNames from 'classnames'
import { isThisYear, isToday, lightFormat } from 'date-fns'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CoreStateManager } from '../../core'
import { EmulatorContext } from '../lib/contexts'

function humanizeDate(date: Date) {
  if (isToday(date)) {
    return lightFormat(date, 'HH:mm:ss')
  }
  if (isThisYear(date)) {
    return lightFormat(date, 'MM-dd HH:mm')
  }
  return lightFormat(date, 'yyyy-MM-dd HH:mm')
}

export function StatesList({ name }) {
  const [states, setStates] = useState<any[]>()
  const [pending, setPending] = useState(false)
  const coreStateManagerRef = useRef()

  const emulator = useContext(EmulatorContext)

  useEffect(() => {
    coreStateManagerRef.current = new CoreStateManager({
      core: emulator?.core,
      name: emulator?.rom?.file.name,
      directory: 'retro-assembly/states/',
      fileSystemProvider: window.l,
    })
  }, [])

  const fetchStates = useCallback(
    async function () {
      if (!emulator) {
        return
      }
      const states = await coreStateManagerRef.current.getStates()
      setStates(states)
    },
    [emulator]
  )

  async function loadState(stateId: string) {
    if (pending) {
      return
    }
    if (!emulator) {
      return
    }
    setPending(true)

    try {
      const state = await coreStateManagerRef.current.getStateContent(stateId)
      await emulator?.loadState(state)
    } catch (error) {
      console.warn(error)
    }

    setPending(false)
  }

  useEffect(() => {
    fetchStates()
  }, [fetchStates])

  if (!emulator) {
    return
  }

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
