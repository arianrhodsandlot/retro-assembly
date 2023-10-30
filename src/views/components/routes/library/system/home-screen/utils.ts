export function isFocusingHome() {
  if (!document.activeElement) {
    return false
  }

  const gameEntryGrid = document.querySelector('.game-entry-grid')
  const systemNavigation = document.querySelector('.system-navigation')

  if (!gameEntryGrid || !systemNavigation) {
    return false
  }

  return gameEntryGrid.contains(document.activeElement) || systemNavigation.contains(document.activeElement)
}
