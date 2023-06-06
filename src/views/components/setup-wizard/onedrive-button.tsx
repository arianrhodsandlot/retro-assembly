import { useStore } from 'jotai'
import { useState } from 'react'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'
import { BaseButton } from '../primitives/button'
import { OnedriveDirectoryPicker } from './onedrive-directory-picker'

export function OnedriveButton() {
  const store = useStore()
  const [showPicker, setShowPicker] = useState(false)

  async function onSelect(romDirectory: string) {
    await system.updateSettings({ fileSystem: 'onedrive', directory: romDirectory })
    setShowPicker(false)
    store.set(needsValidateSystemConfigAtom, true)
  }

  return (
    <>
      <BaseButton onClick={() => setShowPicker(true)} styleType='primary'>
        <span className='icon-[simple-icons--microsoftonedrive] h-5 w-5' />
        select a directory from OneDrive
      </BaseButton>
      <OnedriveDirectoryPicker isOpen={showPicker} onSelect={onSelect} />
    </>
  )
}
