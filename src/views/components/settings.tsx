import { useAtom } from 'jotai'
import { useState } from 'react'
import { system } from '../../core'
import { isSettingsModalOpen } from '../lib/atoms'
import { Modal } from './modal'
import { GeneralSettings } from './settings-forms/general-settings'

function getCurrentGeneralSettings() {
  return {
    romProviderType: system.preference.get('romProviderType'),
    handle: undefined,
  }
}

export function Settings() {
  const [isOpen, setIsOpen] = useAtom(isSettingsModalOpen)
  const [generalSettings, setGeneralSettings] = useState(getCurrentGeneralSettings())

  function saveSettings() {
    setIsOpen(false)
  }

  async function onChange(value) {
    const { romProviderType, handle, romDirectory } = value
    if (romProviderType !== generalSettings.romProviderType) {
      system.setFileSystemProviderType(romProviderType)
    }

    if (romProviderType === 'local' && handle) {
      await system.setLocalFileSystemHandle(handle)
      system.setWorkingDirectory('')
    }

    if (romProviderType === 'onedrive' && romDirectory) {
      system.setWorkingDirectory(romDirectory)
    }

    setGeneralSettings(getCurrentGeneralSettings())
  }

  return (
    <Modal isOpen={isOpen} onClickBackdrop={() => setIsOpen(false)}>
      <>
        <GeneralSettings value={generalSettings} onChange={onChange} />
        <button onClick={saveSettings}>save</button>
      </>
    </Modal>
  )
}
