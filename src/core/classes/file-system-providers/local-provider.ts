import { initial, last } from 'lodash-es'
import { type FileSummary, type FileSystemProvider } from './file-system-provider'

export class LocalProvider implements FileSystemProvider {
  private files: File[]
  private handle: FileSystemDirectoryHandle | undefined

  private constructor() {
    this.files = []
    this.load()
  }

  static getSingleton() {
    return new LocalProvider()
  }

  async listDirFilesRecursely(path: string) {
    const files: FileSummary[] = []
    for (const file of this.files) {
      if (file.webkitRelativePath.startsWith(path)) {
        const fileSummary: FileSummary = {
          name: file.name,
          dir: file.webkitRelativePath,
          path: file.webkitRelativePath,
          downloadUrl: '',
        }
        files.push(fileSummary)
      }
    }
    return await files
  }

  async getFileContent(path: string) {
    for (const file of this.files) {
      if (file.webkitRelativePath === path) {
        const arrayBuffer = await file.arrayBuffer()
        const blob = new Blob([arrayBuffer])
        if (blob) {
          return blob
        }
      }
    }
  }

  // path should not start with a slash
  // todo: should make it be the same as the onedrive provider
  async createFile({ file, path }: { file: Blob; path: string }) {
    const fileHandle = await this.getFileHandle({ path, create: true })
    if (fileHandle) {
      const writableStream = await fileHandle.createWritable()
      try {
        await writableStream.write(file)
      } finally {
        await writableStream.close()
      }
    }
  }

  async deleteFile(path: string) {
    const fileHandle = await this.getFileHandle({ path, create: true })
    await fileHandle?.remove()
  }

  private async load() {
    const { handle, files } = await directoryOpen({ recursive: true, mode: 'readwrite' })
    this.files = files
    this.handle = handle
  }

  private async getFileHandle({ path, create }: { path: string; create: boolean }) {
    const segments = path.split('/')
    const directorySegments = segments.length > 1 ? initial(segments) : []
    const fileName = last(segments)
    let directoryHandle = this.handle
    for (const segment of directorySegments) {
      directoryHandle = await directoryHandle.getDirectoryHandle(segment, { create })
    }
    if (fileName) {
      return await directoryHandle.getFileHandle(fileName, { create })
    }
  }
}

async function getFiles(dirHandle, recursive, path = dirHandle.name, skipDirectory) {
  const dirs = []
  const files = []
  for await (const entry of dirHandle.values()) {
    const nestedPath = `${path}/${entry.name}`
    if (entry.kind === 'file') {
      files.push(
        entry.getFile().then((file) => {
          file.directoryHandle = dirHandle
          file.handle = entry
          return Object.defineProperty(file, 'webkitRelativePath', {
            configurable: true,
            enumerable: true,
            get: () => nestedPath,
          })
        })
      )
    } else if (entry.kind === 'directory' && recursive && (!skipDirectory || !skipDirectory(entry))) {
      dirs.push(getFiles(entry, recursive, nestedPath, skipDirectory))
    }
  }
  return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))]
}

async function directoryOpen(options = {}) {
  options.recursive = options.recursive || false
  options.mode = options.mode || 'read'
  const handle = await window.showDirectoryPicker({
    id: options.id,
    startIn: options.startIn,
    mode: options.mode,
  })

  // Else, return an array of File objects.
  const files = await getFiles(handle, options.recursive, undefined, options.skipDirectory)
  return {
    handle,
    files,
  }
}
