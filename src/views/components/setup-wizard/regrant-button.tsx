import { useStore } from 'jotai'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'
import { BaseButton } from '../primitives/button'

export function RegrantButton() {
  const store = useStore()

  async function regrant() {
    try {
      await system.grantPermissionManually()
      store.set(needsValidateSystemConfigAtom, true)
    } catch {}
  }

  return (
    <BaseButton onClick={regrant} styleType='primary'>
      <span className='icon-[mdi--folder-open] h-5 w-5' />
      regrant the permission
    </BaseButton>
  )
}
