import { initial, last, tail } from 'lodash-es'
import { FileSummary } from './file-summary'
import { type FileSystemProvider } from './file-system-provider'

export class LocalProvider implements FileSystemProvider {
  private files: File[]
  private handle: FileSystemDirectoryHandle | undefined

  private constructor() {
    this.files = []
  }

  static async getSingleton() {
    const local = new LocalProvider()
    await local.load()
    return local
  }

  async listDirFilesRecursely(path?: string) {
    const files: FileSummary[] = []
    for (const file of this.files) {
      const rawRelativePathSegments = file.webkitRelativePath.split('/')
      const relativePath = tail(rawRelativePathSegments).join('/')
      if (!path || relativePath.startsWith(path)) {
        const fileSummary = new FileSummary({
          path: relativePath,
          downloadUrl: URL.createObjectURL(file),
          blob: file,
        })
        files.push(fileSummary)
      }
    }
    return await Promise.resolve(files)
  }

  async getFileContent(path: string) {
    for (const file of this.files) {
      const rawRelativePathSegments = file.webkitRelativePath.split('/')
      const relativePath = tail(rawRelativePathSegments).join('/')
      if (relativePath === path) {
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
      // @ts-expect-error "createWritable" is not listed in typescript's declaration files
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
    // @ts-expect-error "remove" is not listed in typescript's declaration files
    await fileHandle?.remove()
  }

  private async load() {
    const { handle, files } = await directoryOpen({
      id: 'retro-assembly-rom-directory',
      recursive: true,
      // mode: 'readwrite',
    })
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
  console.log(options.id)
  const handle = await window.showDirectoryPicker({
    id: options.id,
    startIn: options.startIn,
    mode: options.mode,
  })
  console.log(handle)

  // Else, return an array of File objects.
  const files = await getFiles(handle, options.recursive, undefined, options.skipDirectory)
  return {
    handle,
    files,
  }
}
