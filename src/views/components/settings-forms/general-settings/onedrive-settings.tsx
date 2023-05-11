import { useEffect, useState } from 'react'
import { system, ui } from '../../../../core'
import { RemoteDirectoryPicker } from './remote-directory-picker'

export function OnedriveSettings({ onChange }: { onChange: (value: { romDirectory: string }) => void }) {
  const [pending, setPending] = useState(true)
  const [hasLogin, setHasLogin] = useState(false)
  const [loginText, setLoginText] = useState('Checking OneDrive login status...')

  async function checkNeedsLogin() {
    setPending(true)
    const needsLogin = await system.needsOnedriveLogin()
    setHasLogin(!needsLogin)
    setPending(false)
  }

  function onSelectDirectory(path) {
    onChange({ romDirectory: path })
  }

  useEffect(() => {
    checkNeedsLogin()
  }, [])

  useEffect(() => {
    if (!pending && !system.isRetrievingToken()) {
      setLoginText(hasLogin ? 'Logined to OneDrive!' : 'Login to OneDrive')
    }
  }, [pending, hasLogin])

  useEffect(() => {
    ui.onOnedriveToken({
      start() {
        setHasLogin(false)
        setLoginText('Logining to OneDrive...')
      },
      success() {
        setHasLogin(true)
        setLoginText('Logined to OneDrive!')
      },
      error() {
        setHasLogin(false)
        setLoginText('Login to OneDrive')
      },
    })
  }, [])

  return (
    <div>
      <div>
        {hasLogin ? <div>2. {loginText}</div> : <button onClick={() => ui.prepare('onedrive')}>2. {loginText}</button>}
      </div>

      {hasLogin && (
        <div>
          <button>3. Select directory</button>
          <RemoteDirectoryPicker onSelect={onSelectDirectory} />
        </div>
      )}
    </div>
  )
}
