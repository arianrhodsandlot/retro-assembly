import classNames from 'classnames'
import { isThisYear, isToday, lightFormat } from 'date-fns'
import { useCallback, useContext, useEffect, useState } from 'react'
import { OneDriveCloudProvider } from '../../core'
import { EmulatorContext } from '../lib/contexts'

const onedrive = OneDriveCloudProvider.get()

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

  const emulator = useContext(EmulatorContext)

  const fetchStates = useCallback(
    async function () {
      if (!emulator) {
        return
      }

      const { core } = emulator
      const states = await onedrive.getStates({ name, core })

      setStates(states)
    },
    [emulator, name]
  )

  async function loadState(path) {
    if (pending) {
      return
    }
    if (!emulator) {
      return
    }
    setPending(true)

    try {
      const state = await onedrive.downloadFile(path)
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
            key={state.createTime}
            role='button'
            onClick={() => loadState(state.path)}
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
            {humanizeDate(state.createTime)}
          </div>
        ))}
      </div>
    </div>
  )
}
