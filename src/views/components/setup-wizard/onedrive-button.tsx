import { useStore } from 'jotai'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'
import { BaseButton } from '../primitives/button'
import { BaseDialog } from '../primitives/dialog'
import { OnedriveDirectoryPicker } from './onedrive-directory-picker'

export function OnedriveButton() {
  const store = useStore()

  async function onSelect(romDirectory: string) {
    await system.updateSettings({ fileSystem: 'onedrive', directory: romDirectory })
    store.set(needsValidateSystemConfigAtom, true)
  }

  return (
    <BaseDialog content={<OnedriveDirectoryPicker onSelect={onSelect} />}>
      <BaseButton styleType='primary'>
        <span className='icon-[simple-icons--microsoftonedrive] h-5 w-5' />
        select a cloud Directory
      </BaseButton>
    </BaseDialog>
  )
}
