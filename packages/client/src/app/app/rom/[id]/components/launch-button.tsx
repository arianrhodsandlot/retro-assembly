'use client'
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
        height: '560px',
        left: '50%',
        marginLeft: '-280px',
        marginTop: '-280px',
        position: 'fixed',
        top: '50%',
        width: '560px',
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

  return isLoading ? (
    <div className='bg-rose-700 opacity-40 text-white text-2xl w-36 flex justify-center py-3 rounded'>loading...</div>
  ) : (
    <button
      className='bg-rose-700 text-white text-2xl px-4 flex justify-center py-3 rounded'
      onClick={handleClick}
      type='button'
    >
      Press any key to start!
    </button>
  )
}
