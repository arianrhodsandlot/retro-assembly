import { useAtom } from 'jotai'
import { useState } from 'react'
import { system } from '../../../core'
import { isSettingsModalOpenAtom } from '../../lib/atoms'
import { GeneralSettings } from '../settings-forms/directory-settings'
import { Modal } from './modal'

function getCurrentGeneralSettings() {
  return {
    romProviderType: system.preference.get('romProviderType'),
    handle: undefined,
    romDirectory: '',
  }
}

export function Settings() {
  const [isOpen, setIsOpen] = useAtom(isSettingsModalOpenAtom)
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
      await system.start()
    } else if (romProviderType === 'onedrive' && romDirectory) {
      system.updateSettings({ fileSystem: romProviderType, directory: romDirectory })
      setGeneralSettings(getCurrentGeneralSettings())
      closeSettingsModal()
      await system.start()
    } else {
      setGeneralSettings({ ...generalSettings, ...value })
    }
  }

  return (
    <Modal isOpen={isOpen} onClickBackdrop={() => setIsOpen(false)}>
      <GeneralSettings onChange={onChange} value={generalSettings} />
    </Modal>
  )
}
