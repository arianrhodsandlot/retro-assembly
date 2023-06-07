import { useAtomValue } from 'jotai'
import { system } from '../../../../core'
import { BaseButton } from '../../primitives/base-button'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { onSetupAtom } from '../atoms'
import { OnedriveDirectoryPicker } from './onedrive-directory-picker'

export function OnedriveButton() {
  const onSetup = useAtomValue(onSetupAtom)

  async function onSelect(romDirectory: string) {
    await system.updateSettings({ fileSystem: 'onedrive', directory: romDirectory })
    onSetup?.()
  }

  return (
    <BaseDialogTrigger content={<OnedriveDirectoryPicker onSelect={onSelect} />}>
      <BaseButton styleType='primary'>
        <span className='icon-[simple-icons--microsoftonedrive] h-5 w-5' />
        select a cloud Directory
      </BaseButton>
    </BaseDialogTrigger>
  )
}
