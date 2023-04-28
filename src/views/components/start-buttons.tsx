import { directoryOpen, fileOpen } from 'browser-fs-access'
import { extSystemMap } from '../../core'
import '../styles/index.sass'
import { OneDriveCloudProvider } from '../../core/classes/onedrive-cloud-provider'

const allowedExtensions = new Set(['zip', ...Object.keys(extSystemMap)])
function filterRoms(files: Blob[]) {
  return (
    files?.filter((file) => {
      const ext = file.name.split('.').at(-1)
      return ext && allowedExtensions.has(ext)
    }) ?? []
  )
}

const onedriveCloudProvider = new OneDriveCloudProvider()
window.O = OneDriveCloudProvider
window.o = onedriveCloudProvider
window.c = onedriveCloudProvider.client

export default function StartButtons({
  onSelectRom,
  onSelectRoms,
}: {
  onSelectRom: (roms: Blob) => void
  onSelectRoms: (roms: Blob[]) => void
}) {
  async function selectDir() {
    try {
      const selectedFiles = (await directoryOpen({ recursive: true, id: 'test' })) as Blob[]
      const roms = filterRoms(selectedFiles)
      onSelectRoms(roms)
    } catch {}
  }

  async function selectFile() {
    try {
      const file = await fileOpen()
      const selectedFiles = [file]
      const [rom] = filterRoms(selectedFiles)
      if (rom) {
        onSelectRom(rom)
      }
    } catch {}
  }

  function loginWithOnedrive() {
    OneDriveCloudProvider.authorize()
  }

  async function loadOnedrive() {
    const blob = await onedriveCloudProvider.download('/test-roms/snes/Contra III - The Alien Wars (USA).zip')
    blob.name = 'Contra III - The Alien Wars (USA).zip'
    blob.webkitRelativePath = '/test-roms/snes/Contra III - The Alien Wars (USA).zip'
    onSelectRom(blob)
  }

  return (
    <div className='bg-slate flex min-h-screen items-center justify-center gap-10 text-3xl text-gray-400'>
      <button onClick={selectFile}>Select File</button>
      <button onClick={selectDir}>Select Directory</button>
      <button onClick={loginWithOnedrive}>Login with Onedrive</button>
      <button onClick={loadOnedrive}>Load Onedrive</button>
    </div>
  )
}
