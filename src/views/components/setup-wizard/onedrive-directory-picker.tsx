import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { system } from '../../../core'
import { needsOnedriveLoginAtom } from './atoms'
import { OnedriveDirectoryTree } from './onedrive-directory-tree'
import { OnedriveLoginEntry } from './onedrive-login-entry'

export function OnedriveDirectoryPicker({ onSelect }: { onSelect: (path: string) => void }) {
  const [needsOnedriveLogin, setNeedsOnedriveLogin] = useAtom(needsOnedriveLoginAtom)

  const updateNeedsLogin = useCallback(async () => {
    const needsLogin = await system.needsOnedriveLogin()
    setNeedsOnedriveLogin(needsLogin)
  }, [setNeedsOnedriveLogin])

  useEffect(() => {
    updateNeedsLogin()
  }, [updateNeedsLogin])

  return (
    <div className='w-96 max-w-full'>
      {needsOnedriveLogin === true ? <OnedriveLoginEntry onFinished={updateNeedsLogin} /> : null}
      {needsOnedriveLogin === false ? (
        <div className='flex h-full flex-col'>
          <div className='text-red-600'>
            <div className='rounded  border border-red-600 bg-red-100 px-4 py-2 text-sm'>
              Select a directory to initialize your game library.
            </div>
          </div>
          <div className='flex-1 overflow-auto'>
            <OnedriveDirectoryTree onSelect={onSelect} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
