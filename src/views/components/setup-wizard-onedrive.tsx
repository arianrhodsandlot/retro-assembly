import { useEffect, useState } from 'react'
import { ui } from '../../core'
import { RemoteDirectoryPicker } from './remote-directory-picker'

export function SetupWizardOnedrive({
  pending,
  steps,
  onChange,
  onError,
}: {
  pending: boolean
  steps: string[]
  onChange: (path: string) => void
  onError: () => void
}) {
  const needsPrepare = steps.includes('prepare')
  const needsSelectOnedriveDirectory = !needsPrepare && steps.includes('preference')
  const [loginText, setLoginText] = useState(
    needsSelectOnedriveDirectory ? 'Logined to OneDrive!' : 'Login to OneDrive'
  )
  useEffect(() => {
    setLoginText(needsSelectOnedriveDirectory ? 'Logined to OneDrive!' : 'Login to OneDrive')
  }, [needsSelectOnedriveDirectory])

  useEffect(() => {
    ui.onOnedriveToken({
      start() {
        setLoginText('Logining to OneDrive...')
      },
      success() {
        setLoginText('Logined to OneDrive!')
      },
      error() {
        setLoginText('Login to OneDrive')
        onError()
      },
    })
  }, [onError])

  if (pending) {
    return <></>
  }

  return (
    <div>
      <div>{needsPrepare ? <button onClick={ui.prepare}>2. {loginText}</button> : <div>2. {loginText}</div>}</div>

      {needsSelectOnedriveDirectory && (
        <div>
          <button>3. Select directory</button>
          <RemoteDirectoryPicker onSelect={onChange} />
        </div>
      )}
    </div>
  )
}
