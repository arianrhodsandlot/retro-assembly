import { BlobReader, ZipReader } from '@zip.js/zip.js'
import { GamesDatabase } from '../classes/games-database'
import { extSystemMap, systemCoreMap } from '../constants/systems'

export async function readFileAsUint8Array(file: Blob) {
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

async function guessSystemByExtractedContent(file: Blob) {
  if (!file) {
    return ''
  }
  const blobReader = new BlobReader(file)
  const zipReader = new ZipReader(blobReader)
  try {
    const entries = await zipReader.getEntries()
    for (const { filename } of entries) {
      const system = guessSystemByFileName(filename)
      if (system) {
        return system
      }
    }
  } catch (error) {
    console.warn(error)
  }
  return ''
}

const systems = Object.keys(systemCoreMap).sort((core1, core2) => core2.length - core1.length)
function guessSystemByPath(file: Blob) {
  if (!file?.webkitRelativePath) {
    return
  }
  for (const system of systems) {
    if (file.webkitRelativePath.includes(system)) {
      return system
    }
  }
}

export async function guessSystem(file: Blob) {
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

export async function guessCore(file: Blob) {
  const system = await guessSystem(file)
  return systemCoreMap[system] ?? ''
}

export async function guessGameDetail(rom: Blob) {
  const system = await guessSystem(rom)
  return await GamesDatabase.queryByFileNameFromSystem({ fileName: rom.name, system })
}
