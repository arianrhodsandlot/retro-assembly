import { lightFormat, parse, toDate } from 'date-fns'
import { type FileSystemProvider } from './file-system-providers/file-system-provider'

const stateCreateTimeFormat = 'yyyyMMddHHmmssSSS'

export class CoreStatesManager {
  core: string
  directory: string
  fileSystemProvider: FileSystemProvider

  constructor({
    core,
    directory,
    fileSystemProvider,
  }: {
    core: string
    directory: string
    fileSystemProvider: FileSystemProvider
  }) {
    this.core = core
    this.directory = directory
    this.fileSystemProvider = fileSystemProvider
  }

  async createState(state) {
    const { fileSystemProvider, directory } = this
    const { core, name, createTime, blob, thumbnailBlob } = state
    const stateBaseFileName = lightFormat(toDate(createTime), stateCreateTimeFormat)
    const stateDirPath = `${directory}states/${core}/${name}/`
    await Promise.all([
      fileSystemProvider.createFile({ file: blob, path: `${stateDirPath}${stateBaseFileName}.state` }),
      fileSystemProvider.createFile({ file: thumbnailBlob, path: `${stateDirPath}${stateBaseFileName}.png` }),
    ])
  }

  async getStates({ name }) {
    const { fileSystemProvider, core, directory } = this
    const stateDirPath = `${directory}states/${core}/${name}/`
    const children = await fileSystemProvider.listDirFilesRecursely(stateDirPath)
    const states: any = []
    const thumbnailMap: Record<string, string> = {}

    for (const child of children) {
      const [base, ext] = child.name.split('.')
      const createTime = parse(base, stateCreateTimeFormat, new Date())
      if (createTime) {
        if (ext === 'state') {
          const state = {
            name,
            createTime,
            path: child.path,
            thumbnailUrl: '',
          }
          states.push(state)
        } else if (ext === 'png') {
          thumbnailMap[base] = child.downloadUrl
        }
      }
    }

    for (const state of states) {
      const key = lightFormat(state.createTime, stateCreateTimeFormat)
      state.thumbnailUrl = thumbnailMap[key] ?? state.thumbnailUrl
    }

    return states
  }

  async deleteState({ core, name, createTime }) {
    const { fileSystemProvider } = this
    const stateBaseFileName = createTime
    const stateDirPath = `/test-roms/retro-assembly/states/${core}/${name}/`
    await Promise.allSettled([
      fileSystemProvider.deleteFile(`${stateDirPath}${stateBaseFileName}.state`),
      fileSystemProvider.deleteFile(`${stateDirPath}${stateBaseFileName}.png`),
    ])
  }
}
