import { type IDBPDatabase, openDB } from 'idb'
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
  }: {
    func: (...params: any[]) => Promise<any>
    identifier?: string | any | ((...params: any) => string)
    prediction?: any
  }) {
    const requestCache = await RequestCache.getSingleton()
    return requestCache.makeCacheable({ func, identifier, prediction })
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

  async set(key: string, value: any) {
    const { database } = this
    if (!database) {
      throw databaseNotInitializedError
    }

    await database.put(tableName, {
      [indexkeyPath]: key,
      value,
      createTime: new Date(),
    })
  }

  async get(key: string) {
    const { database } = this
    if (!database) {
      throw databaseNotInitializedError
    }

    const [row] = await database.getAllFromIndex(tableName, indexName, key)
    return row
  }

  async remove(key: string) {
    const { database } = this
    if (!database) {
      throw databaseNotInitializedError
    }
    const row = await database.getFromIndex(tableName, indexName, key)
    if (row?.id) {
      await database.delete(tableName, row.id)
    }
  }

  makeCacheable({
    func,
    identifier = (...args) => JSON.stringify({ functionName: func.name, args }),
    maxAge,
    prediction,
  }: {
    func: (...args: any[]) => Promise<any>
    identifier?: string | any | ((...args: any) => string)
    maxAge?: number
    prediction?: any
  }) {
    return async (...args) => {
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
      const result = await func(...args)
      await this.set(cacheKey, result)
      return result
    }
  }
}

function getCacheKey({ identifier, args }) {
  switch (typeof identifier) {
    case 'string':
      return identifier
    case 'function':
      return getCacheKey({ identifier: identifier(...args), args })
    default:
      return JSON.stringify(identifier)
  }
}
