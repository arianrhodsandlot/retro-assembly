import { FolderOpenIcon } from '@heroicons/react/24/outline'
import { useStore } from 'jotai'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'

export function RegrantButton() {
  const store = useStore()

  async function regrant() {
    try {
      await system.grantPermissionManually()
      store.set(needsValidateSystemConfigAtom, true)
    } catch {}
  }

  return (
    <button className='rounded border-2 border-red-600 bg-red-600 px-4 py-2 text-lg text-white' onClick={regrant}>
      <FolderOpenIcon className='mr-2 inline-block h-4 w-4' />
      regrant the permission
    </button>
  )
}
