import { type IDBPDatabase, deleteDB, openDB } from 'idb'
import { isMatch } from 'lodash-es'

const databaseName = 'request-cache'
const databaseVersion = 1
const tableName = 'records'
const indexName = 'identifier'
const indexkeyPath = 'identifier'

const databaseNotInitializedError = new Error('database is not initialized')

export class RequestCache {
  static initialization: Promise<RequestCache>

  private database: IDBPDatabase<unknown> | undefined

  static async getSingleton() {
    RequestCache.initialization ??= new RequestCache().initialize()
    return await RequestCache.initialization
  }

  static async makeCacheable({
    func,
    identifier,
    prediction,
    maxAge,
    cacheOnly,
  }: {
    func: (...params: any[]) => Promise<any>
    identifier?: string | any | ((...params: any) => string)
    prediction?: any
    maxAge?: number
    cacheOnly?: boolean
  }) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.makeCacheable({ func, identifier, prediction, maxAge, cacheOnly })
  }

  static async set(key: unknown, value: any) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.set(key, value)
  }

  static async get(key: unknown) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.get(key)
  }

  static async remove(key: unknown) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.remove(key)
  }

  static async destory() {
    const requestCache = await RequestCache.getSingleton()
    requestCache.database?.close()
    await deleteDB(databaseName)
  }

  async initialize() {
    this.database = await openDB(databaseName, databaseVersion, {
      upgrade(database) {
        database
          .createObjectStore(tableName, { keyPath: 'id', autoIncrement: true })
          .createIndex(indexName, indexkeyPath)
      },
    })
    return this
  }

  async set(key: unknown, value: any) {
    const { database } = this
    if (!database) {
      throw databaseNotInitializedError
    }

    const indexkey = typeof key === 'string' ? key : JSON.stringify(key)
    const [row] = await database.getAllFromIndex(tableName, indexName, indexkey)

    const newRow = { [indexkeyPath]: indexkey, value, createTime: Date.now() }
    if (row?.id) {
      Object.assign(newRow, { id: row.id })
    }
    await database.put(tableName, newRow)
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

  makeCacheable({
    func,
    identifier = (...args) => JSON.stringify({ functionName: func.name, args }),
    maxAge,
    prediction,
    cacheOnly,
  }: {
    func: (...args: any[]) => Promise<any>
    identifier?: string | any | ((...args: any) => string)
    maxAge?: number
    prediction?: any
    cacheOnly?: boolean
  }) {
    const cacheKeys = new Set<string>()
    const clearCache = () => {
      for (const cacheKey of cacheKeys) {
        this.remove(cacheKey)
      }
    }
    const cacheable = async (...args) => {
      const cacheKey = getCacheKey({ identifier, args })
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
}

function getCacheKey({ identifier, args }) {
  if (typeof identifier === 'function') {
    return getCacheKey({ identifier: identifier(...args), args })
  }
  return JSON.stringify({ identifier, args })
}
