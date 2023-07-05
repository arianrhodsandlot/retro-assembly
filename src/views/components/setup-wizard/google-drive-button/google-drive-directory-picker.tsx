import { useEffect } from 'react'
import { useAsyncRetry } from 'react-use'
import { detectNeedsLogin } from '../../../../core'
import { SpatialNavigation } from '../../../lib/spatial-navigation'
import { DirectoryTree } from '../cloud-service/directory-tree'
import { GoogleDriveLoginEntry } from './google-drive-login-entry'

export function GoogleDriveDirectoryPicker({
  isValidating,
  onSelect,
}: {
  isValidating: boolean
  onSelect: (path: string) => void
}) {
  const state = useAsyncRetry(async () => await detectNeedsLogin('google-drive'))

  useEffect(() => {
    if (state.value === true) {
      SpatialNavigation.focus('modal')
    }
  }, [state.value])

  if (isValidating || state.loading) {
    return (
      <div className='flex items-center justify-center py-6'>
        <span className='icon-[line-md--loading-loop] h-12 w-12 text-rose-700' />
      </div>
    )
  }

  if (state.value === true) {
    return <GoogleDriveLoginEntry onFinished={state.retry} />
  }

  if (state.value === false) {
    return (
      <div className='flex h-full flex-col'>
        <div className='text-rose-700'>
          <div className='flex items-center rounded border border-rose-700 bg-rose-100 px-4 py-2 text-sm'>
            <span className='icon-[mdi--bell] mr-2 h-4 w-4' />
            Select a directory to initialize your game library.
          </div>
        </div>
        <div className='flex-1 overflow-auto'>
          <DirectoryTree cloudService='google-drive' onSelect={onSelect} />
        </div>
      </div>
    )
  }
}
