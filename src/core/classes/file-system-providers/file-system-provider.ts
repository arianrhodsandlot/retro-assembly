const stateCreateTimeFormat = 'yyyyMMddHHmmssSSS'

export interface FileSummary {
  name: string
  dir: string
  path: string
  downloadUrl: string
}

export interface FileSystemProvider {
  getFileContent: (path: string) => Promise<Blob | undefined>
  createFile: ({ file, path }: { file: Blob; path: string }) => Promise<void>
  deleteFile: (path: string) => Promise<void>
  listDirFilesRecursely: (path: string) => Promise<FileSummary[]>
}
