import { useAtom } from 'jotai'
import { useState } from 'react'
import { system } from '../../../core'
import { needsSetupAtom } from '../../lib/atoms'
import { GeneralSettings } from '../settings-forms/directory-settings'
import { Modal } from './modal'

function getCurrentGeneralSettings() {
  return {
    romProviderType: system.preference.get('romProviderType'),
    handle: undefined,
  }
}

export default function SetupWizard({ onSubmit }: { onSubmit: () => void }) {
  const [needsSetup] = useAtom(needsSetupAtom)
  const [generalSettings, setGeneralSettings] = useState(getCurrentGeneralSettings())

  async function onChange(value) {
    const { romProviderType, handle, romDirectory } = value
    if (romProviderType !== generalSettings.romProviderType) {
      system.setFileSystemProviderType(romProviderType)
    }

    if (romProviderType === 'local') {
      await system.updateSettings({ fileSystem: 'local', directory: '', handle })
    } else if (romProviderType === 'onedrive') {
      await system.updateSettings({ fileSystem: 'onedrive', directory: romDirectory })
    }

    setGeneralSettings(getCurrentGeneralSettings())
    onSubmit()
  }

  return (
    <Modal isOpen={needsSetup}>
      <GeneralSettings onChange={onChange} value={generalSettings} />
    </Modal>
  )
}
