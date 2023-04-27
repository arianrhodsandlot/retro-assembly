import { type FileWithDirectoryAndFileHandle, directoryOpen, fileOpen } from 'browser-fs-access'
import { extSystemMap } from '../../core'
import '../styles/index.sass'

const allowedExtensions = new Set(['zip', ...Object.keys(extSystemMap)])
function filterRoms(files: FileWithDirectoryAndFileHandle[]) {
  return (
    files?.filter((file) => {
      const ext = file.name.split('.').at(-1)
      return ext && allowedExtensions.has(ext)
    }) ?? []
  )
}

export default function StartButtons({
  onSelectRom,
  onSelectRoms,
}: {
  onSelectRom: (roms: File) => void
  onSelectRoms: (roms: File[]) => void
}) {
  async function selectDir() {
    try {
      const selectedFiles = (await directoryOpen({ recursive: true, id: 'test' })) as FileWithDirectoryAndFileHandle[]
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

  return (
    <div className='bg-slate flex min-h-screen items-center justify-center gap-10 text-3xl text-gray-400'>
      <button onClick={selectFile}>Select File</button>
      <button onClick={selectDir}>Select Directory</button>
    </div>
  )
}
