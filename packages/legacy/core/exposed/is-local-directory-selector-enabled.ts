export function isLocalDirectorySelectorEnabled() {
  return typeof globalThis.showDirectoryPicker === 'function'
}
