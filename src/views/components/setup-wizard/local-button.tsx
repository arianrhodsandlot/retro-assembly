import { useStore } from 'jotai'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'
import { BaseButton } from '../primitives/button'

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
    <BaseButton onClick={selectLocalDirectory}>
      <span className='icon-[mdi--desktop-classic] h-5 w-5' />
      select a local directory
    </BaseButton>
  )
}
