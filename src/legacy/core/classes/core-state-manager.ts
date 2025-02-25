import { lightFormat, parse, toDate } from 'date-fns'
import { orderBy } from 'lodash-es'
import { humanizeDate } from '../helpers/misc'
import { path } from '../helpers/vendors'
import type { FileAccessor } from './file-system-providers/file-accessor'
import type { FileSystemProvider } from './file-system-providers/file-system-provider'

const stateCreateTimeFormat = 'yyyyMMddHHmmssSSS'

interface CoreStateParams {
  blob: Blob
  core: string
  createTime: number
  name: string
  thumbnailBlob?: Blob
}

interface CoreState {
  createTime: {
    date: Date
    humanized: string
  }
  id: string
  name: string
  path: string
  thumbnail: FileAccessor | undefined
}

export class CoreStateManager {
  core: string
  directory: string
  fileSystemProvider: FileSystemProvider
  name: string

  constructor({
    core,
    directory,
    fileSystemProvider,
    name,
  }: {
    core: string
    directory: string
    fileSystemProvider: FileSystemProvider
    name: string
  }) {
    this.core = core
    this.name = name
    this.directory = directory
    this.fileSystemProvider = fileSystemProvider
  }

  async createState(state: CoreStateParams) {
    const { directory, fileSystemProvider } = this
    const { blob, core, createTime, name, thumbnailBlob } = state
    const stateBaseFileName = lightFormat(toDate(createTime), stateCreateTimeFormat)
    const stateDirPath = path.join(directory, core, name)
    await fileSystemProvider.create({ file: blob, path: path.join(stateDirPath, `${stateBaseFileName}.state`) })
    if (thumbnailBlob) {
      fileSystemProvider.create({ file: thumbnailBlob, path: path.join(stateDirPath, `${stateBaseFileName}.png`) })
    }
  }

  async deleteState(stateId: string) {
    const { core, directory, fileSystemProvider, name } = this
    const stateDirPath = path.join(directory, core, name)
    await Promise.allSettled([
      fileSystemProvider.delete(path.join(stateDirPath, `${stateId}.state`)),
      fileSystemProvider.delete(path.join(stateDirPath, `${stateId}.png`)),
    ])
  }

  async getStateContent(stateId: string) {
    const { core, directory, fileSystemProvider, name } = this
    const stateDirPath = path.join(directory, core, name)
    const statePath = path.join(stateDirPath, `${stateId}.state`)
    return await fileSystemProvider.getContent(statePath)
  }

  async getStates() {
    const { core, directory, fileSystemProvider, name } = this
    const stateDirPath = path.join(directory, core, name)

    let fileAccessors: FileAccessor[] = []
    try {
      fileAccessors = await fileSystemProvider.list(stateDirPath)
    } catch (error) {
      if (isInvalidDirectoryError(error)) {
        return []
      }
      throw error
    }

    const states: CoreState[] = []
    const thumbnailMap: Record<string, FileAccessor> = {}

    const now = new Date()
    for (const fileAccessor of fileAccessors) {
      const { basename, extname, path } = fileAccessor
      const createTime = parse(basename, stateCreateTimeFormat, now)
      if (createTime) {
        if (extname === 'state') {
          const state = {
            createTime: { date: createTime, humanized: humanizeDate(createTime) },
            id: basename,
            name,
            path,
            thumbnail: undefined,
          }
          states.push(state)
        } else if (extname === 'png') {
          thumbnailMap[basename] = fileAccessor
        }
      }
    }

    for (const state of states) {
      const key = lightFormat(state.createTime.date, stateCreateTimeFormat)
      state.thumbnail = thumbnailMap[key] ?? state.thumbnail
    }

    return orderBy(states, ['createTime.date'], ['desc'])
  }
}

function isInvalidDirectoryError(error: any) {
  // local file system
  if (error?.name === 'NotFoundError') {
    return true
  }
  // onedrive
  if (error?.code === 'itemNotFound') {
    return true
  }
  // google drive
  return error?.message?.startsWith?.('directory not found')
}
