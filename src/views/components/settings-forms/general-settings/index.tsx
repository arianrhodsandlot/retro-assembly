import { OnedriveSettings } from './onedrive-settings'

export function GeneralSettings({ value, onChange }: { value; onChange?: (value: any) => void }) {
  function updateValue(newValue) {
    onChange?.({ ...value, ...newValue })
  }

  async function selectLocalDirectory() {
    // @ts-expect-error `showDirectoryPicker` is not defined in ts's default declaration files
    const handle = await showDirectoryPicker({ mode: 'readwrite' })
    updateValue({ handle })
  }

  function onOnedriveSettingsChange(value: { romDirectory: string }) {
    updateValue(value)
  }

  const { romProviderType } = value

  return (
    <div className='absolute left-[50%] top-[50%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-white p-4'>
      <div>
        <div>1. Would you like to select your roms directory from your local disk or from Onedrive?</div>
        <div>
          <select value={romProviderType} onChange={(event) => updateValue({ romProviderType: event.target.value })}>
            {!romProviderType && <option value=''>Please select</option>}
            <option value='local'>local</option>
            <option value='onedrive'>OneDrive</option>
          </select>
        </div>

        {romProviderType === 'local' && (
          <div>
            <button onClick={selectLocalDirectory}>2. Select a directory from your disk</button>
          </div>
        )}

        {romProviderType === 'onedrive' && <OnedriveSettings onChange={onOnedriveSettingsChange} />}
      </div>
    </div>
  )
}
