import { useEffect, useState } from 'react'
import { system, ui } from '../../core'
import { SetupWizardOnedrive } from './setup-wizard-onedrive'

export default function SetupWizard({
  controlled,
  show,
  onClose,
}: {
  controlled: boolean
  show?: boolean
  onClose?: () => void
}) {
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

  function onBackdropClick() {
    if (controlled) {
      onClose?.()
    }
  }

  useEffect(() => {
    reloadStepsSiliently()
  }, [romDirectoryType])

  const shouldShow = controlled ? show : steps.length

  if (!shouldShow) {
    return <></>
  }

  return (
    <div className='fixed left-0 top-0 flex h-screen w-screen'>
      <div className='absolute h-full w-full  bg-[#000000af]' onClick={onBackdropClick} aria-hidden></div>
      <div className='absolute left-[50%] top-[50%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-white p-4'>
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
