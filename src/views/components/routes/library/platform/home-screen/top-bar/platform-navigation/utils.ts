export function getPlatformDisplayName(fullName: string) {
  const shortName = fullName.split(' - ')[1]
  return !shortName || /^\d+$/.test(shortName) ? fullName : shortName
}
