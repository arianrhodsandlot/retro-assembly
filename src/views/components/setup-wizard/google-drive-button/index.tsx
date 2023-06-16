import { useAtomValue, useSetAtom } from 'jotai'
import { system, ui } from '../../../../core'
import { BaseButton } from '../../primitives/base-button'
import { BaseDialogTrigger } from '../../primitives/base-dialog-trigger'
import { isInvalidDialogOpenAtom, onSetupAtom } from '../atoms'
import { GoogleDriveDirectoryPicker } from './google-drive-directory-picker'

export function GoogleDriveButton() {
  const onSetup = useAtomValue(onSetupAtom)
  const setIsInvalidDialogOpen = useSetAtom(isInvalidDialogOpenAtom)

  async function onSelect(romDirectory: string) {
    const isValid = await ui.validateRomsDirectory({
      directory: romDirectory,
      type: 'google-drive',
    })

    if (isValid) {
      await system.updateSettings({ fileSystem: 'google-drive', directory: romDirectory })
      onSetup?.()
    } else {
      setIsInvalidDialogOpen(true)
    }
  }

  return (
    <BaseDialogTrigger
      content={
        <div className='w-96 max-w-full'>
          <GoogleDriveDirectoryPicker onSelect={onSelect} />
        </div>
      }
    >
      <BaseButton className='w-60' styleType='primary'>
        <span className='icon-[logos--google-drive] h-5 w-5' />
        Google Drive
        <sup>beta</sup>
      </BaseButton>
    </BaseDialogTrigger>
  )
}
