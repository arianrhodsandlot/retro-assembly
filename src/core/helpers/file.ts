import { get, set } from 'idb-keyval'

export async function readBlobAsUint8Array(file: Blob) {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  return await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.addEventListener('load', () => {
      resolve(new Uint8Array(fileReader.result as ArrayBuffer))
    })
  })
}

export async function detectLocalHandleExistence(name: string) {
  const handles = (await get('local-file-system-handles')) ?? {}
  const handle = handles[name]
  return Boolean(handle)
}

export async function detectLocalHandlePermission({ name, mode }: { name: string; mode: string }) {
  const handles = await get('local-file-system-handles')
  const permission = await handles?.[name]?.queryPermission({ mode })
  return permission === 'granted'
}

export async function requestLocalHandle({ name, mode }: { name: string; mode: string }) {
  const handles = (await get('local-file-system-handles')) ?? {}

  if (handles[name]) {
    const handle = handles[name]
    const permission = await handle.requestPermission({ mode })
    if (permission === 'granted') {
      return handle
    }
  } else {
    const handle: FileSystemDirectoryHandle = await showDirectoryPicker({ mode })
    handles[name] = handle
    await set('local-file-system-handles', handles)
    return handle
  }
}

export async function listFilesByHandle({ handle, path = handle.name }: { handle: FileSystemHandle; path?: string }) {
  const dirs = []
  const files = []
  for await (const entry of handle.values()) {
    const nestedPath = `${path}/${entry.name}`
    if (entry.kind === 'file') {
      files.push(
        entry.getFile().then((file) => {
          file.directoryHandle = handle
          file.handle = entry
          return Object.defineProperty(file, 'webkitRelativePath', {
            configurable: true,
            enumerable: true,
            get: () => nestedPath,
          })
        })
      )
    } else if (entry.kind === 'directory') {
      dirs.push(listFilesByHandle({ handle: entry, path: nestedPath }))
    }
  }
  return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))]
}
