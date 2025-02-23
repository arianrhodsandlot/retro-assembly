'use client'
import { clsx } from 'clsx'
import { Nostalgist } from 'nostalgist'
import { useEffect } from 'react'
import useSWRImmutable from 'swr/immutable'
import { platformCoreMap } from '@/constants/platform'

export function LaunchButton({ rom }) {
  const romUrl = `/api/v1/rom/${rom.id}/content`

  const { data: nostalgist, error, isLoading } = useSWRImmutable(romUrl, prepareEmulator)

  async function prepareEmulator(romUrl) {
    return await Nostalgist.prepare({
      core: platformCoreMap[rom.platform],
      rom: romUrl,
      shader: 'crt/crt-easymode',
      style: {
        bottom: '0',
        height: '480px',
        position: 'fixed',
        right: '0',
        width: '480px',
      },
    })
  }

  async function handleClick() {
    if (error) {
      console.error(error)
    }

    await nostalgist?.start()
  }

  useEffect(() => {
    return () => {
      nostalgist?.exit()
    }
  }, [nostalgist])

  return (
    <button
      className={clsx(
        'inline-flex h-16 w-72 items-center justify-center gap-1.5 rounded bg-rose-700 text-xl  font-bold text-white',
        { 'opacity-50': isLoading },
      )}
      disabled={isLoading}
      onClick={handleClick}
      type='button'
    >
      <span className={isLoading ? 'icon-[mdi--loading] animate-spin' : 'icon-[mdi--play]'} />
      {isLoading ? 'Loading...' : 'Press any key to start'}
    </button>
  )
}
