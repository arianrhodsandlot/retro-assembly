import { OneDriveProvider, system } from '../../../core'

const authorizeUrl = system.getOnedriveAuthorizeUrl()

let authorizeWindow: Window | null

export function OnedriveLoginEntry({ onFinished }: { onFinished: () => void }) {
  function onStorage(event: StorageEvent) {
    if (event.key === OneDriveProvider.tokenStorageKey) {
      authorizeWindow?.close()
      removeEventListener('storage', onStorage)
      onFinished()
    }
  }

  function login(event) {
    event.preventDefault()
    authorizeWindow = open(authorizeUrl)
    addEventListener('storage', onStorage)
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='px-4 pt-6 text-red-600'>
        <div className='rounded border border-red-600 bg-red-100 px-4 py-2 text-sm'>
          {'To select a roms directory from your Microsoft OneDrive, you need to login to Microsoft first.'}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-center px-4 text-center'>
        <div>
          <a
            className='inline-flex items-center justify-center rounded border-2 border-red-600 bg-red-600 px-4 py-2 text-lg text-white'
            href={authorizeUrl}
            onClick={login}
            rel='noreferrer'
            target='_blank'
          >
            <span className='icon-[logos--microsoft-icon] mr-2 inline-block h-5 w-5' />
            Login
          </a>
        </div>
      </div>
    </div>
  )
}
