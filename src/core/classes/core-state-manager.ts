import { lightFormat, parse, toDate } from 'date-fns'
import { humanizeDate } from '../helpers/misc'
import { type FileSystemProvider } from './file-system-providers/file-system-provider'

const stateCreateTimeFormat = 'yyyyMMddHHmmssSSS'

interface CoreState {
  id: string
  core: string
  name: string
  createTime: number
  blob: Blob
  thumbnailBlob?: Blob
}

interface CoreStateSummary {
  name: string
  createTime: {
    date: Date
    humanized: string
  }
  path: string
  thumbnailUrl: string
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

  async createState(state: CoreState) {
    const { fileSystemProvider, directory } = this
    const { core, name, createTime, blob, thumbnailBlob } = state
    const stateBaseFileName = lightFormat(toDate(createTime), stateCreateTimeFormat)
    const stateDirPath = `${directory}${core}/${name}/`
    await Promise.all([
      fileSystemProvider.createFile({ file: blob, path: `${stateDirPath}${stateBaseFileName}.state` }),
      ...(thumbnailBlob
        ? [fileSystemProvider.createFile({ file: thumbnailBlob, path: `${stateDirPath}${stateBaseFileName}.png` })]
        : []),
    ])
  }

  async getStates() {
    const { fileSystemProvider, core, directory, name } = this
    const stateDirPath = `${directory}${core}/${name}/`
    const children = await fileSystemProvider.listDirFilesRecursively(stateDirPath)
    const states: CoreStateSummary[] = []
    const thumbnailMap: Record<string, string> = {}

    for (const child of children) {
      const [base, ext] = child.name.split('.')
      const createTime = parse(base, stateCreateTimeFormat, new Date())
      if (createTime) {
        if (ext === 'state') {
          const state = {
            id: base,
            name,
            createTime: { humanized: humanizeDate(createTime), date: createTime },
            path: child.path,
            thumbnailUrl: '',
          }
          states.push(state)
        } else if (ext === 'png') {
          // todo: downloadUrl is not supported for local provider
          thumbnailMap[base] = child.downloadUrl
        }
      }
    }

    for (const state of states) {
      const key = lightFormat(state.createTime.date, stateCreateTimeFormat)
      state.thumbnailUrl = thumbnailMap[key] ?? state.thumbnailUrl
    }

    return states
  }

  async deleteState(stateId: string) {
    const { fileSystemProvider, directory, core, name } = this
    const stateDirPath = `${directory}${core}/${name}/`
    await Promise.allSettled([
      fileSystemProvider.deleteFile(`${stateDirPath}${stateId}.state`),
      fileSystemProvider.deleteFile(`${stateDirPath}${stateId}.png`),
    ])
  }

  async getStateContent(stateId: string) {
    const { fileSystemProvider, directory, core, name } = this
    const stateDirPath = `${directory}${core}/${name}/`
    const statePath = `${stateDirPath}${stateId}.state`
    return await fileSystemProvider.getFileContent(statePath)
  }
}
