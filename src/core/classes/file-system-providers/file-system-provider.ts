import { type FileSummary } from './file-summary'

export interface FileSystemProvider {
  getFileContent: (path: string) => Promise<Blob | undefined>
  createFile: ({ file, path }: { file: Blob; path: string }) => Promise<void>
  deleteFile: (path: string) => Promise<void>
  listFilesRecursively: (path: string) => Promise<FileSummary[]>
  listChildren: (path: string) => Promise<any[]>
}
