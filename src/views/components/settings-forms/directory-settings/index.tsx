import { OnedriveSettings } from './onedrive-settings'

export function GeneralSettings({
  value,
  onChange,
  onStartRedirect,
}: {
  value
  onChange?: (value: any) => void
  onStartRedirect?: (type: string) => void
}) {
  function updateValue(newValue) {
    onChange?.({ ...value, ...newValue })
  }

  async function selectLocalDirectory() {
    try {
      // @ts-expect-error `showDirectoryPicker` is not defined in ts's default declaration files
      const handle = await showDirectoryPicker({ mode: 'readwrite' })
      updateValue({ handle })
    } catch {}
  }

  function onOnedriveSettingsChange(value: { romDirectory: string }) {
    updateValue(value)
  }

  const { romProviderType } = value

  return (
    <div>
      <div>1. Would you like to select your roms directory from your local disk or from Onedrive?</div>
      <div>
        <select onChange={(event) => updateValue({ romProviderType: event.target.value })} value={romProviderType}>
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
  )
}
