import { type FileAccessor } from './file-accessor'

export interface FileSystemProvider {
  getFileContent: (path: string) => Promise<Blob>

  createFile: ({ file, path }: { file: Blob; path: string }) => Promise<void>
  deleteFile: (path: string) => Promise<void>

  listChildren: (path: string) => Promise<FileAccessor[]>
}
