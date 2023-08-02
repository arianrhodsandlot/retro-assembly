import { deleteDB } from 'idb'
import { clear } from 'idb-keyval'
import { RequestCache } from '../classes/request-cache'
import { globalContext } from '../internal/global-context'

async function clearIdbKeyval() {
  try {
    await clear()
  } catch {}
  try {
    await deleteDB('keyval-store')
  } catch {}
}

async function clearReqiestCache() {
  try {
    await RequestCache.destory()
  } catch {}
}

export async function teardown() {
  await Promise.all([clearIdbKeyval(), clearReqiestCache()])
  localStorage.clear()
  globalContext.fileSystem = undefined
}
