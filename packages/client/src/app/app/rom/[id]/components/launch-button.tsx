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
      style: { height: '100px', position: 'static', width: '100px' },
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
    <div>loading...</div>
  ) : (
    <button onClick={handleClick} type='button'>
      Launch
    </button>
  )
}
