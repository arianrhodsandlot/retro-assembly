import { OneDriveProvider, LocalProvider } from '../../core'

function loginWithOnedrive() {
  OneDriveProvider.authorize()
}

export default function StartButtons({ onSelectFiles }: { onSelectFiles: (roms: File[]) => void }) {
  async function selectDir() {
    try {
      const local = await LocalProvider.getSingleton()
      window.l = local
      onSelectFiles(local.files)
    } catch {}
  }

  return (
    <div className='bg-slate flex min-h-screen items-center justify-center gap-10 text-3xl text-gray-400'>
      <button onClick={selectDir}>Select Directory</button>
      <button onClick={loginWithOnedrive}>Login with Onedrive</button>
    </div>
  )
}
