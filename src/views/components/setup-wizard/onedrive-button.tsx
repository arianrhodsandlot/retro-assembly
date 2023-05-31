import { CloudIcon } from '@heroicons/react/24/outline'
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
        className='rounded border-2 border-red-600 bg-red-600 px-4 py-2 text-lg text-white'
        onClick={() => setShowPicker(true)}
      >
        <CloudIcon className='mr-2 inline-block h-4 w-4' />
        select a directory from OneDrive
      </button>
      <OnedriveDirectoryPicker isOpen={showPicker} onSelect={onSelect} />
    </>
  )
}
