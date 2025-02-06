import { isAfter } from 'date-fns'
import store2 from 'store2'

const store = store2.local

export function setStorageByKey({ expireAt, key, value }: { expireAt?: Date; key: string; value: unknown }) {
  store.set(key, {
    meta: {
      expireAt: expireAt?.getTime(),
    },
    value,
  })
}

export function getStorageByKey(key: string) {
  const rawValue = store.get(key)
  if (rawValue) {
    const expireAt = rawValue.meta?.expireAt
    const isExpired = expireAt && isAfter(expireAt, new Date())
    if (isExpired) {
      store.remove(key)
      return
    }
    return rawValue.value
  }
}
