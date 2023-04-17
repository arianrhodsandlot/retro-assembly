import { type FileWithDirectoryAndFileHandle, directoryOpen, fileOpen } from 'browser-fs-access'
import { useState } from 'react'
import HomeScreen from './home-screen'
import './index.sass'

export default function App() {
  const [files, setFiles] = useState<FileWithDirectoryAndFileHandle[] | FileSystemDirectoryHandle[]>()

  async function selectDir() {
    try {
      const selectedFiles = await directoryOpen({ recursive: true, id: 'test' })
      setFiles(selectedFiles)
    } catch {}
  }

  async function selectFile() {
    try {
      const file = await fileOpen()
      setFiles([file])
    } catch {}
  }

  return (
    <div style={{ position: 'absolute', zIndex: 1 }}>
      <p>
        <button onClick={selectFile}>select file</button>
        <br />
        <button onClick={selectDir}>select dir</button>
      </p>
      <div>{files ? <HomeScreen files={files} /> : undefined}</div>
    </div>
  )
}
