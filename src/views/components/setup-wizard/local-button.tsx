import { FolderOpenIcon } from '@heroicons/react/24/outline'
import { useStore } from 'jotai'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'

export function LocalButton() {
  const store = useStore()

  async function selectLocalDirectory() {
    try {
      // @ts-expect-error `showDirectoryPicker` is not defined in ts's default declaration files
      const handle = await showDirectoryPicker({ mode: 'readwrite' })
      await system.updateSettings({ fileSystem: 'local', directory: '', handle })
      store.set(needsValidateSystemConfigAtom, true)
    } catch {}
  }

  return (
    <button
      className='rounded border-2 border-red-600 bg-white px-4 py-2 text-lg text-red-600'
      onClick={selectLocalDirectory}
    >
      <FolderOpenIcon className='mr-2 inline-block h-4 w-4' />
      select a local directory
    </button>
  )
}
