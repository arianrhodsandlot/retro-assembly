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

  async function readRdb(e) {
    const [file] = e.target.files
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(file)
    await new Promise((resolve) => {
      fileReader.addEventListener('load', () => {
        resolve(fileReader.result)
      })
    })
    const { result } = fileReader
    const match = `${result}`.match(/(?<=\u00BD)(\w+.*?)(?=\u00EF)/g)
    window.match = match
    // String.fromCodePoint(charCode)
  }

  return (
    <div style={{ position: 'absolute', zIndex: 1 }}>
      <input type='file' name='' id='' onChange={readRdb} />
      <p>
        <button onClick={selectDir}>selectDir</button>
      </p>
      {files ? <HomeScreen files={files} /> : undefined}
    </div>
  )
}
