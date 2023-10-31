export function isFocusingHome() {
  if (!document.activeElement) {
    return false
  }

  const gameEntryGrid = document.querySelector('.game-entry-grid')
  const platformNavigation = document.querySelector('.platform-navigation')

  if (!gameEntryGrid || !platformNavigation) {
    return false
  }

  return gameEntryGrid.contains(document.activeElement) || platformNavigation.contains(document.activeElement)
}
