import { directoryOpen, fileOpen } from 'browser-fs-access'
import '../styles/index.sass'
import { OneDriveCloudProvider } from '../../core/classes/onedrive-cloud-provider'

const oneDrive = new OneDriveCloudProvider()
window.O = OneDriveCloudProvider
window.o = oneDrive
window.c = oneDrive.client

function loginWithOnedrive() {
  OneDriveCloudProvider.authorize()
}

export default function StartButtons({
  onSelectFile,
  onSelectFiles,
  onSelectOneDriveFile,
}: {
  onSelectFile: (roms: File) => void
  onSelectFiles: (roms: File[]) => void
  onSelectOneDriveFile: (urls: string[]) => void
}) {
  async function selectDir() {
    try {
      const selectedFiles = (await directoryOpen({ recursive: true, id: 'test' })) as File[]
      onSelectFiles(selectedFiles)
    } catch {}
  }

  async function selectFile() {
    try {
      const file = await fileOpen()
      if (file) {
        onSelectFile(file)
      }
    } catch {}
  }

  async function loadOnedrive() {
    const selectedDir = '/test-roms/nes/'
    const remoteFilePaths = []
    const { value: children } = await oneDrive.listDir(selectedDir)
    for (const child of children) {
      if (child.file) {
        const dir = child.parentReference.path.replace(/^\/drive\/root:/, '')
        const path = `${dir}/${child.name}`
        remoteFilePaths.push({
          dir,
          path,
          fileName: child.name,
        })
      }
    }
    onSelectOneDriveFile(remoteFilePaths)
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
