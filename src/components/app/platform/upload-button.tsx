'use client'
import { fileOpen } from 'browser-fs-access'
import { clsx } from 'clsx'
import ky from 'ky'
import useSWRMutation from 'swr/mutation'
import { useRouter_UNSTABLE } from 'waku/router/client'

export function UploadButton({ platform }: { platform: string }) {
  const router = useRouter_UNSTABLE()

  const { isMutating, trigger } = useSWRMutation('/api/v1/rom/new', async (url, { arg: files }: { arg: File[] }) => {
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }
    formData.append('platform', platform)
    await ky.post(url, { body: formData })
  })

  async function handleClick() {
    const files = await fileOpen({ multiple: true })
    await trigger(files)
    router.reload()
  }

  return (
    <button
      className={clsx(
        'fixed bottom-12 right-12 flex size-12 items-center justify-center rounded-full bg-rose-700 text-2xl text-white shadow',
        { 'opacity-50': isMutating },
      )}
      disabled={isMutating}
      onClick={handleClick}
      type='button'
    >
      {isMutating ? <span className='icon-[svg-spinners--180-ring]' /> : <span className='icon-[mdi--upload]' />}
    </button>
  )
}
