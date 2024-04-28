import { lightFormat, parse, toDate } from 'date-fns'
import { orderBy } from 'lodash-es'
import { join } from 'path-browserify'
import { humanizeDate } from '../helpers/misc'
import type { FileAccessor } from './file-system-providers/file-accessor'
import type { FileSystemProvider } from './file-system-providers/file-system-provider'

const stateCreateTimeFormat = 'yyyyMMddHHmmssSSS'

interface CoreStateParams {
  core: string
  name: string
  createTime: number
  blob: Blob
  thumbnailBlob?: Blob
}

interface CoreState {
  id: string
  name: string
  createTime: {
    date: Date
    humanized: string
  }
  path: string
  thumbnail: FileAccessor | undefined
}

export class CoreStateManager {
  core: string
  name: string
  directory: string
  fileSystemProvider: FileSystemProvider

  constructor({
    core,
    name,
    directory,
    fileSystemProvider,
  }: {
    core: string
    name: string
    directory: string
    fileSystemProvider: FileSystemProvider
  }) {
    this.core = core
    this.name = name
    this.directory = directory
    this.fileSystemProvider = fileSystemProvider
  }

  async createState(state: CoreStateParams) {
    const { fileSystemProvider, directory } = this
    const { core, name, createTime, blob, thumbnailBlob } = state
    const stateBaseFileName = lightFormat(toDate(createTime), stateCreateTimeFormat)
    const stateDirPath = join(directory, core, name)
    await fileSystemProvider.create({ file: blob, path: join(stateDirPath, `${stateBaseFileName}.state`) })
    if (thumbnailBlob) {
      fileSystemProvider.create({ file: thumbnailBlob, path: join(stateDirPath, `${stateBaseFileName}.png`) })
    }
  }

  async getStates() {
    const { fileSystemProvider, core, directory, name } = this
    const stateDirPath = join(directory, core, name)

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
            id: basename,
            name,
            createTime: { humanized: humanizeDate(createTime), date: createTime },
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

  async deleteState(stateId: string) {
    const { fileSystemProvider, directory, core, name } = this
    const stateDirPath = join(directory, core, name)
    await Promise.allSettled([
      fileSystemProvider.delete(join(stateDirPath, `${stateId}.state`)),
      fileSystemProvider.delete(join(stateDirPath, `${stateId}.png`)),
    ])
  }

  async getStateContent(stateId: string) {
    const { fileSystemProvider, directory, core, name } = this
    const stateDirPath = join(directory, core, name)
    const statePath = join(stateDirPath, `${stateId}.state`)
    return await fileSystemProvider.getContent(statePath)
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
