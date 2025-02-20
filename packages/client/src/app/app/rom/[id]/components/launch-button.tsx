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
        'bg-rose-700 w-72 text-white font-bold text-xl inline-flex justify-center h-16 rounded  items-center gap-1.5',
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
