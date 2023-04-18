import { BlobReader, ZipReader } from '@zip.js/zip.js'
import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { extSystemMap, systemCoreMap } from './constants'

export async function readFileAsUint8Array(file: FileWithDirectoryAndFileHandle) {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  return await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.addEventListener('load', () => {
      resolve(new Uint8Array(fileReader.result as ArrayBuffer))
    })
  })
}

function guessSystemByFilename(filename: string) {
  const extname = filename.split('.').pop()
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
      const core = guessSystemByFilename(filename)
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
    : guessSystemByFilename(file.name)

  if (!system) {
    throw new Error(`Unknown system for ${file.name}`)
  }

  return system
}

export async function guessCore(file: FileWithDirectoryAndFileHandle) {
  const system = await guessSystem(file)
  return systemCoreMap[system] ?? ''
}
