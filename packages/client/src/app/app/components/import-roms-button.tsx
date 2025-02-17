'use client'
import { fileOpen } from 'browser-fs-access'
import ky from 'ky'
import useSWRMutation from 'swr/mutation'

export function ImportROMsButton() {
  const { isMutating, trigger } = useSWRMutation('/api/user', async (url, { arg: files }: { arg: File[] }) => {
    const formData = new FormData()
    formData.append('platform', 'nes')
    for (const file of files) {
      formData.append('file', file)
    }
    await ky.post('/api/v1/rom/upload', {
      body: formData,
    })
  })

  async function handleClickImportRoms() {
    const files = await fileOpen({ multiple: true })
    trigger(files)
  }

  return (
    <button disabled={isMutating} onClick={handleClickImportRoms} type='button'>
      {isMutating ? 'importing...' : 'import ROMs'}
    </button>
  )
}
