import { EmscriptenFS, FileSystem, initialize } from 'browserfs'

const userdataDir = '/home/web_user/retroarch/userdata'
const inMemoryFS = new FileSystem.InMemory()
const mountableFS = new FileSystem.MountableFileSystem()

export function createEmscriptenFS({ FS, PATH, ERRNO_CODES }) {
  inMemoryFS.empty()
  try {
    mountableFS.umount(userdataDir)
  } catch {}
  mountableFS.mount(userdataDir, inMemoryFS)

  initialize(mountableFS)

  return new EmscriptenFS(FS, PATH, ERRNO_CODES)
}
