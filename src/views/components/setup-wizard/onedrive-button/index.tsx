import { useAtomValue, useSetAtom } from 'jotai'
import { system, ui } from '../../../../core'
import { BaseButton } from '../../primitives/base-button'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { isInvalidDialogOpenAtom, onSetupAtom } from '../atoms'
import { OnedriveDirectoryPicker } from './onedrive-directory-picker'

export function OnedriveButton() {
  const onSetup = useAtomValue(onSetupAtom)
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)

  async function onSelect(romDirectory: string) {
    const isValid = await ui.validateRomsDirectory(romDirectory)

    if (isValid) {
      await system.updateSettings({ fileSystem: 'onedrive', directory: romDirectory })
      onSetup?.()
    } else {
      setIsInvalidDialogOpen(true)
    }
  }

  return (
    <BaseDialogTrigger
      content={
        <div className='w-96 max-w-full'>
          <OnedriveDirectoryPicker onSelect={onSelect} />
        </div>
      }
    >
      <BaseButton styleType='primary'>
        <span className='icon-[simple-icons--microsoftonedrive] h-5 w-5' />
        select a cloud directory
      </BaseButton>
    </BaseDialogTrigger>
  )
}
