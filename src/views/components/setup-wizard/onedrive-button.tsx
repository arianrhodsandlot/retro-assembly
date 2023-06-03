import { useStore } from 'jotai'
import { useState } from 'react'
import { system } from '../../../core'
import { needsValidateSystemConfigAtom } from '../../lib/atoms'
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
      <button
        className='flex items-center justify-center rounded border-2 border-red-600 bg-red-600 px-4 py-2 text-lg text-white'
        onClick={() => setShowPicker(true)}
      >
        <span className='icon-[simple-icons--microsoftonedrive] mr-2 inline-block h-5 w-5' />
        select a directory from OneDrive
      </button>
      <OnedriveDirectoryPicker isOpen={showPicker} onSelect={onSelect} />
    </>
  )
}
