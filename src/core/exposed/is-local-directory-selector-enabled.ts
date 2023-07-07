export function isLocalDirectorySelectorEnabled() {
  return typeof window.showDirectoryPicker === 'function'
}
