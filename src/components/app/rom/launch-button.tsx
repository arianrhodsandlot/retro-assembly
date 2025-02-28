'use client'
import { useKeyboardEvent, useToggle } from '@react-hookz/web'
import { clsx } from 'clsx'
import { Nostalgist } from 'nostalgist'
import { useEffect } from 'react'
import useSWRMutation from 'swr/mutation'
import { platformCoreMap } from '@/constants/platform.ts'

const directionKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'])
export function LaunchButton({ rom }) {
  const romUrl = `/api/v1/rom/${rom.id}/content`

  const { data: nostalgist, isMutating, trigger } = useSWRMutation(romUrl, prepareEmulator)
  const [started, toggleStarted] = useToggle()

  function exit() {
    toggleStarted(false)
    nostalgist?.exit()
    trigger()
  }

  useKeyboardEvent(true, (event) => {
    if (started) {
      if (event.key === 'Escape') {
        exit()
      }
    } else {
      const isSpecialKey = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
      const isDirectionKey = directionKeys.has(event.key)
      if (!isSpecialKey && !isDirectionKey && event.key !== 'Escape') {
        start()
      }
    }
  })

  useEffect(() => {
    trigger()
  }, [trigger])

  async function prepareEmulator(romUrl) {
    return await Nostalgist.prepare({
      core: platformCoreMap[rom.platform],
      rom: romUrl,
      // shader: 'crt/crt-nes-mini',
    })
  }

  async function start() {
    await nostalgist?.start()
    toggleStarted(true)
  }

  useEffect(() => {
    return () => {
      toggleStarted(false)
      nostalgist?.exit()
    }
  }, [nostalgist, toggleStarted])

  return (
    <button
      className={clsx(
        'inline-flex h-16 w-72 items-center justify-center gap-1.5 rounded bg-rose-700 text-xl  font-bold text-white',
        { 'opacity-50': isMutating },
      )}
      disabled={isMutating}
      onClick={start}
      type='button'
    >
      <span className={isMutating ? 'icon-[mdi--loading] animate-spin' : 'icon-[mdi--play]'} />
      {isMutating ? 'Loading...' : 'Press any key to start'}
    </button>
  )
}
