import { EmscriptenFS, FileSystem, initialize } from 'browserfs'
import pify from 'pify'

const userdataDir = '/home/web_user/retroarch/userdata'

const inMemoryFS = new FileSystem.InMemory()
const mountableFS = new FileSystem.MountableFileSystem()

const createIndexDBFS = pify(FileSystem.IndexedDB.Create)
const createAsyncMirrorFS = pify(FileSystem.AsyncMirror.Create)

let indexedDBFS
let asyncMirrorFS

export async function createEmscriptenFS({ FS, PATH, ERRNO_CODES }) {
  // indexedDBFS ??= await createIndexDBFS({ storeName: 'retro-assembly' })
  // asyncMirrorFS ??= await createAsyncMirrorFS({ sync: inMemoryFS, async: indexedDBFS })
  inMemoryFS.empty()
  try {
    mountableFS.umount(userdataDir)
  } catch {}
  mountableFS.mount(userdataDir, inMemoryFS)

  initialize(mountableFS)

  return new EmscriptenFS(FS, PATH, ERRNO_CODES)
}
