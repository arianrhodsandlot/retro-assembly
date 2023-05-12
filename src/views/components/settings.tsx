import { useAtom } from 'jotai'
import { useState } from 'react'
import { system } from '../../core'
import { isSettingsModalOpen } from '../lib/atoms'
import { Modal } from './modal'
import { GeneralSettings } from './settings-forms/directory-settings'

function getCurrentGeneralSettings() {
  return {
    romProviderType: system.preference.get('romProviderType'),
    handle: undefined,
    romDirectory: '',
  }
}

export function Settings() {
  const [isOpen, setIsOpen] = useAtom(isSettingsModalOpen)
  const [generalSettings, setGeneralSettings] = useState(getCurrentGeneralSettings())

  function closeSettingsModal() {
    setIsOpen(false)
  }

  async function onChange(value) {
    const { romProviderType, handle, romDirectory } = value

    if (romProviderType === 'local' && handle) {
      await system.setLocalFileSystemHandle(handle)
      system.updateSettings({ fileSystem: romProviderType, directory: '' })
      setGeneralSettings(getCurrentGeneralSettings())
      closeSettingsModal()
    } else if (romProviderType === 'onedrive' && romDirectory) {
      system.updateSettings({ fileSystem: romProviderType, directory: romDirectory })
      setGeneralSettings(getCurrentGeneralSettings())
      closeSettingsModal()
    } else {
      setGeneralSettings({ ...generalSettings, ...value })
    }
  }

  return (
    <Modal isOpen={isOpen} onClickBackdrop={() => setIsOpen(false)}>
      <>
        <GeneralSettings value={generalSettings} onChange={onChange} />
      </>
    </Modal>
  )
}
