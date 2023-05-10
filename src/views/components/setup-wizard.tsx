import { useEffect, useState } from 'react'
import { system, ui } from '../../core'
import { SetupWizardOnedrive } from './setup-wizard-onedrive'

export default function SetupWizard() {
  const [romDirectoryType, setRomDirectoryType] = useState(system.preference?.get('romProviderType') ?? '')
  const [steps, setSteps] = useState<string[]>([])
  const [pending, setPending] = useState(false)

  function onChangeRomDirectoryType(romDirectoryType) {
    setRomDirectoryType(romDirectoryType)
    if (['local', 'onedrive'].includes(romDirectoryType)) {
      system.setFileSystemProviderType(romDirectoryType)
    }
  }

  async function selectLocalDirectory() {
    await ui.prepare()
    if (system.isPreferenceValid()) {
      await reloadStepsSiliently()
    }
  }

  async function selectOnedriveDirectory(path: string) {
    await ui.setWorkingDirectory(path)
    if (system.isPreferenceValid()) {
      await reloadStepsSiliently()
    }
  }

  async function reloadStepsSiliently() {
    const stepsBeforeSetup = await ui.getStepsBeforeStart()
    setSteps(stepsBeforeSetup)
  }

  async function reloadSteps() {
    setPending(true)
    await reloadStepsSiliently()
    setPending(false)
  }

  useEffect(() => {
    reloadStepsSiliently()
  }, [romDirectoryType])

  if (steps.length === 0) {
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
            <SetupWizardOnedrive
              pending={pending}
              steps={steps}
              onChange={selectOnedriveDirectory}
              onError={reloadSteps}
            />
          )}
        </div>
      </div>
    </div>
  )
}
