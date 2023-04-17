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
  const entries = await zipReader.getEntries()
  for (const { filename } of entries) {
    const core = guessSystemByFilename(filename)
    if (core) {
      return core
    }
  }
  return ''
}

function guessSystemByPath(file) {
  if (!file?.webkitRelativePath) {
    return
  }
  if (file.webkitRelativePath.includes('nes')) {
    return 'nes'
  }
  if (file.webkitRelativePath.includes('n64')) {
    return 'n64'
  }
  if (file.webkitRelativePath.includes('gba')) {
    return 'gba'
  }
  if (file.webkitRelativePath.includes('gbc')) {
    return 'gbc'
  }
  if (file.webkitRelativePath.includes('gb')) {
    return 'gb'
  }
  if (file.webkitRelativePath.includes('megadrive')) {
    return 'megadrive'
  }
  if (file.webkitRelativePath.includes('gamegear')) {
    return 'gamegear'
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
  console.log(system)
  return systemCoreMap[system] ?? ''
}
