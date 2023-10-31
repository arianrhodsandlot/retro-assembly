import { useEffect, useState } from 'react'

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
export function useFocusingHome() {
  const [focusingHome, setFocusingHome] = useState(isFocusingHome())

  useEffect(() => {
    function onFocus() {
      setFocusingHome(isFocusingHome())
    }
    document.body.addEventListener('focus', onFocus, true)
    return () => {
      document.body.removeEventListener('focus', onFocus, true)
    }
  })

  return focusingHome
}
