import { BlobReader, ZipReader } from '@zip.js/zip.js'
import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { extSystemMap, systemCoreMap } from './constants'
import { GamesDatabase } from './games-database'

export async function readFileAsUint8Array(file: FileWithDirectoryAndFileHandle) {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  return await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.addEventListener('load', () => {
      resolve(new Uint8Array(fileReader.result as ArrayBuffer))
    })
  })
}

function guessSystemByFileName(fileName: string) {
  const extname = fileName.split('.').pop()
  if (!extname) {
    return ''
  }
  return extSystemMap[extname] ?? ''
}

async function guessSystemByExtractedContent(file: FileWithDirectoryAndFileHandle) {
  if (!file) {
    return ''
  }
  const blobReader = new BlobReader(file)
  const zipReader = new ZipReader(blobReader)
  try {
    const entries = await zipReader.getEntries()
    for (const { filename } of entries) {
      const core = guessSystemByFileName(filename)
      if (core) {
        return core
      }
    }
  } catch (error) {
    console.warn(error)
  }
  return ''
}

const systems = Object.keys(systemCoreMap).sort((core1, core2) => core2.length - core1.length)
function guessSystemByPath(file) {
  if (!file?.webkitRelativePath) {
    return
  }
  for (const system of systems) {
    if (file.webkitRelativePath.includes(system)) {
      return system
    }
  }
}

export async function guessSystem(file: FileWithDirectoryAndFileHandle) {
  if (!file?.name) {
    throw new Error('Invalid file')
  }
  const systemByPath = guessSystemByPath(file)
  if (systemByPath) {
    return systemByPath
  }
  const system = file.name.endsWith('.zip')
    ? await guessSystemByExtractedContent(file)
    : guessSystemByFileName(file.name)

  if (!system) {
    throw new Error(`Unknown system for ${file.name}`)
  }

  return system
}

export async function guessCore(file: FileWithDirectoryAndFileHandle) {
  const system = await guessSystem(file)
  return systemCoreMap[system] ?? ''
}

export async function guessGameDetail(rom: FileWithDirectoryAndFileHandle) {
  const system = await guessSystem(rom)
  return await GamesDatabase.queryByFileNameFromSystem({ fileName: rom.name, system })
}
