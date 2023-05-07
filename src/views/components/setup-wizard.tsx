import { useState } from 'react'
import { system, ui } from '../../core'
import { RemoteDirectoryPicker } from './remote-directory-picker'

export default function SetupWizard() {
  const [showSetupWizard, setShowSetupWizard] = useState(!system.validatePreference())
  const [romDirectoryType, setRomDirectoryType] = useState(system.preference?.get('romProviderType') ?? '')

  function onChangeRomDirectoryType(romDirectoryType) {
    setRomDirectoryType(romDirectoryType)
    if (['local', 'onedrive'].includes(romDirectoryType)) {
      system.setFileSystemProviderType(romDirectoryType)
    }
  }

  async function selectLocalDirectory() {
    await ui.start()
  }

  async function loginWithOnedrive() {
    await ui.start()
  }

  async function selectOnedriveDirectory(path) {
    system.setWorkingDirectory(path)
    if (system.validatePreference()) {
      setShowSetupWizard(false)
    }
  }

  if (!showSetupWizard) {
    return <></>
  }

  return (
    <div className='fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-[#000000af]'>
      <div className='h-96 w-96 bg-white p-4'>
        <div>
          <div>1. Would you like to select your roms directory from your local disk or from Onedrive?</div>
          <div>
            <select
              value={romDirectoryType}
              onChange={(event) => onChangeRomDirectoryType(event.target.value)}
              name='rom-directory-type'
              id='rom-directory-type'
            >
              {!romDirectoryType && <option value=''>Please select</option>}
              <option value='local'>local</option>
              <option value='onedrive'>OneDrive</option>
            </select>
          </div>

          {romDirectoryType === 'local' && (
            <div>
              <button onClick={selectLocalDirectory}>2. Select a directory from your disk</button>
            </div>
          )}

          {romDirectoryType === 'onedrive' && (
            <div>
              <div>
                <button onClick={loginWithOnedrive}>2. login with onedrive</button>
              </div>
              <div>
                <button>3. Select directory</button>
                <RemoteDirectoryPicker onSelect={selectOnedriveDirectory} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
