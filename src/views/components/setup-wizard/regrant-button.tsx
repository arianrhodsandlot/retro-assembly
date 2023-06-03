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
    <button
      className='flex items-center justify-center rounded border-2 border-red-600 bg-red-600 px-4 py-2 text-lg text-white'
      onClick={regrant}
    >
      <span className='icon-[mdi--folder-open] mr-2 inline-block h-5 w-5' />
      regrant the permission
    </button>
  )
}
