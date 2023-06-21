import { clear } from 'idb-keyval'
import { globalContext } from '../internal/global-context'

export async function teardown() {
  localStorage.clear()
  await clear()
  globalContext.fileSystem = undefined
}
