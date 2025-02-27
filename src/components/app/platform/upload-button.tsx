'use client'
import { fileOpen } from 'browser-fs-access'
import ky from 'ky'
import { useRouter_UNSTABLE } from 'waku/router/client'

export function UploadButton({ platform }: { platform: string }) {
  const router = useRouter_UNSTABLE()

  async function handleClick() {
    const file = await fileOpen()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('platform', platform)

    await ky.post('/api/v1/rom/new', {
      body: formData,
    })
    router.reload()
  }

  return (
    <button
      className='fixed bottom-12 right-12 size-12 rounded-full bg-rose-700 text-2xl text-white shadow'
      onClick={handleClick}
      type='button'
    >
      <span className='icon-[mdi--upload]' />
    </button>
  )
}
