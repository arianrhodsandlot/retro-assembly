'use client'
import { Nostalgist } from 'nostalgist'
import useSWR from 'swr/immutable'
import { platformCoreMap } from '@/constants/platform'

export function LaunchButtonInner({ rom }) {
  const romUrl = `/api/v1/rom/${rom.id}/content`

  const { data: nostalgist, error, isLoading } = useSWR(romUrl, prepareEmulator)

  async function prepareEmulator(romUrl) {
    return await Nostalgist.prepare({
      core: platformCoreMap[rom.platform],
      rom: romUrl,
      shader: 'crt/crt-easymode',
    })
  }

  async function handleClick() {
    if (error) {
      console.error(error)
    }

    await nostalgist?.start()
  }

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <button onClick={handleClick} type='button'>
      Launch
    </button>
  )
}
