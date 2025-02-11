import { type IDBPDatabase, openDB } from 'idb'
import { isMatch } from 'lodash-es'

const databaseName = 'request-cache'
const databaseVersion = 1
const tableName = 'records'
const indexName = 'identifier'
const indexkeyPath = 'identifier'

const databaseNotInitializedError = new Error('database is not initialized')

export class RequestCache {
  static readonly initialization: Promise<RequestCache>

  private database: IDBPDatabase<unknown> | undefined

  static async destory() {
    const { database } = await RequestCache.getSingleton()
    if (database) {
      await database.clear(tableName)
    }
  }

  static async get(key: unknown) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.get(key)
  }

  static async getSingleton() {
    RequestCache.initialization ??= new RequestCache().initialize()
    return await RequestCache.initialization
  }

  static async makeCacheable({
    cacheOnly,
    func,
    identifier,
    maxAge,
    prediction,
  }: {
    cacheOnly?: boolean
    func: (...params: any[]) => Promise<any>
    identifier?: ((...params: any) => string) | any | string
    maxAge?: number
    prediction?: any
  }) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.makeCacheable({ cacheOnly, func, identifier, maxAge, prediction })
  }

  static async remove(key: unknown) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.remove(key)
  }

  static async set(key: unknown, value: any) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.set(key, value)
  }

  async get(key: unknown) {
    const { database } = this
    if (!database) {
      throw databaseNotInitializedError
    }

    const indexkey = typeof key === 'string' ? key : JSON.stringify(key)
    const [row] = await database.getAllFromIndex(tableName, indexName, indexkey)
    return row
  }

  async initialize() {
    this.database = await openDB(databaseName, databaseVersion, {
      upgrade(database) {
        database
          .createObjectStore(tableName, { autoIncrement: true, keyPath: 'id' })
          .createIndex(indexName, indexkeyPath)
      },
    })
    return this
  }

  makeCacheable({
    cacheOnly,
    func,
    identifier = (...args) => JSON.stringify({ args, functionName: func.name }),
    maxAge,
    prediction,
  }: {
    cacheOnly?: boolean
    func: (...args: any[]) => Promise<any>
    identifier?: ((...args: any) => string) | any | string
    maxAge?: number
    prediction?: any
  }) {
    const cacheKeys = new Set<string>()
    const clearCache = () => {
      for (const cacheKey of cacheKeys) {
        this.remove(cacheKey)
      }
    }
    const cacheable = async (...args) => {
      const cacheKey = getCacheKey({ args, identifier })
      const cache = await this.get(cacheKey)

      let isCacheValid = Boolean(cache)
      if (isCacheValid) {
        if (prediction && !isMatch(cache.value, prediction)) {
          isCacheValid = false
        }
        if (maxAge && cache.createTime + maxAge < Date.now()) {
          isCacheValid = false
        }
      }

      if (isCacheValid) {
        return cache.value
      }

      if (cache) {
        this.remove(cacheKey)
      }

      if (cacheOnly) {
        return
      }

      const result = await func(...args)
      await this.set(cacheKey, result)
      cacheKeys.add(cacheKey)
      return result
    }

    return { cacheable, clearCache }
  }

  async remove(key: unknown) {
    const { database } = this
    if (!database) {
      throw databaseNotInitializedError
    }
    const indexkey = typeof key === 'string' ? key : JSON.stringify(key)
    const rows = await database.getAllFromIndex(tableName, indexName, indexkey)
    for (const row of rows) {
      if (row?.id) {
        await database.delete(tableName, row.id)
      }
    }
  }

  async set(key: unknown, value: any) {
    const { database } = this
    if (!database) {
      throw databaseNotInitializedError
    }

    const indexkey = typeof key === 'string' ? key : JSON.stringify(key)
    const [row] = await database.getAllFromIndex(tableName, indexName, indexkey)

    const newRow = { createTime: Date.now(), [indexkeyPath]: indexkey, value }
    if (row?.id) {
      Object.assign(newRow, { id: row.id })
    }
    await database.put(tableName, newRow)
  }
}

function getCacheKey({ args, identifier }) {
  if (typeof identifier === 'function') {
    return getCacheKey({ args, identifier: identifier(...args) })
  }
  return JSON.stringify({ args, identifier })
}
