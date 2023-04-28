type LocalStorageName = 'onedrive'

export function getItem(key: LocalStorageName) {
  return localStorage.getItem(key)
}

export function setItem(key: LocalStorageName, item: string) {
  return localStorage.setItem(key, item)
}

export function removeItem(key: LocalStorageName) {
  return localStorage.removeItem(key)
}

export function getJson(key: LocalStorageName) {
  const item = getItem(key)
  if (!item) {
    return {}
  }
  try {
    return JSON.parse(item)
  } catch (error) {
    console.error(error)
    return item
  }
}

export function replaceJson(key: LocalStorageName, value: object) {
  setItem(key, JSON.stringify(value))
}

export function updateJson(key: LocalStorageName, value: object) {
  const json = getJson(key)
  replaceJson(key, { ...json, ...value })
}
