import { type FileSystem } from 'browserfs'

const userdataDir = '/home/web_user/retroarch/userdata'

let inMemoryFS: InstanceType<typeof FileSystem.InMemory>
let mountableFS: InstanceType<typeof FileSystem.MountableFileSystem>

export async function createEmscriptenFS({ FS, PATH, ERRNO_CODES }) {
  const { EmscriptenFS, FileSystem, initialize } = await import('browserfs')

  inMemoryFS ??= new FileSystem.InMemory()
  mountableFS ??= new FileSystem.MountableFileSystem()
  inMemoryFS.empty()
  try {
    mountableFS.umount(userdataDir)
  } catch {}
  mountableFS.mount(userdataDir, inMemoryFS)

  initialize(mountableFS)

  return new EmscriptenFS(FS, PATH, ERRNO_CODES)
}
