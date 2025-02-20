'use client'
import { fileOpen } from 'browser-fs-access'
import ky from 'ky'
import { useSearchParams } from 'next/navigation'
import useSWRMutation from 'swr/mutation'

export function ImportROMsButton() {
  const searchParams = useSearchParams()
  const { isMutating, trigger } = useSWRMutation('/api/user', async (url, { arg: files }: { arg: File[] }) => {
    const formData = new FormData()

    formData.append('platform', searchParams.get('platform') || prompt('platform') || '')
    if (!formData.get('platform')) {
      return
    }

    for (const file of files) {
      formData.append('file', file)
    }
    await ky.post('/api/v1/rom/upload', {
      body: formData,
    })
  })

  async function handleClickImportRoms() {
    try {
      const files = await fileOpen({ multiple: true })
      trigger(files)
    } catch {}
  }

  return (
    <button
      className='size-18 block rounded-full bg-rose-700 text-white shadow-lg shadow-zinc-400'
      disabled={isMutating}
      onClick={handleClickImportRoms}
      type='button'
    >
      <span className='icon-[mdi--upload] size-7' />
    </button>
  )
}
