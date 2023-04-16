import { type FileWithDirectoryAndFileHandle, directoryOpen } from 'browser-fs-access'
import { useState } from 'react'
import HomeScreen from './home-screen'
import './index.sass'

export default function App() {
  const [files, setFiles] = useState<FileWithDirectoryAndFileHandle[] | FileSystemDirectoryHandle[]>()

  async function selectDir() {
    const selectedFiles = await directoryOpen({ recursive: true, id: 'test' })
    setFiles(selectedFiles)
  }

  return (
    <div style={{ position: 'absolute', zIndex: 1 }}>
      <p>
        <button onClick={selectDir}>selectDir</button>
      </p>
      <div>{files ? <HomeScreen files={files} /> : undefined}</div>
    </div>
  )
}
