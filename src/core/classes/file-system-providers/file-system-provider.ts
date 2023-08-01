import { type FileAccessor } from './file-accessor'

export interface FileSystemProvider {
  getContent: (path: string) => Promise<Blob>

  create: ({ file, path }: { file: Blob; path: string }) => Promise<void>
  delete: (path: string) => Promise<void>

  list: (path: string) => Promise<FileAccessor[]>
  peek: (path: string) => Promise<FileAccessor[] | undefined>
  peekContent: (path: string) => Promise<Blob | undefined>
}
