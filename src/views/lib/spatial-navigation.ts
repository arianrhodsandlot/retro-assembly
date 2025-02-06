import { onConfirm, onPress } from '../../core'
import { SpatialNavigation } from '../../vendors/js-spatial-navigation'

SpatialNavigation.init()

SpatialNavigation.add({
  defaultElement: '.get-started button',
  enterTo: 'default-element',
  id: 'get-started',
  leaveFor: { down: '', left: '', right: '', up: '' },
  selector: '.get-started button',
})

SpatialNavigation.add({
  enterTo: 'last-focused',
  id: 'platform-navigation',
  navigableFilter(element: HTMLElement) {
    const boundingClientRect = element.getBoundingClientRect()
    return boundingClientRect.width > 0 && boundingClientRect.height > 0
  },
  selector: '.platform-navigation button',
})

SpatialNavigation.add({
  enterTo: 'last-focused',
  id: 'game-entry-grid',
  selector: '.game-entry-grid button',
})

SpatialNavigation.add({
  id: 'menu-overlay-buttons',
  leaveFor: {
    down: '.menu-overlay-buttons button:first-child',
    left: '',
    right: '@menu-overlay-button-details',
    up: '.menu-overlay-buttons button:last-child',
  },
  restrict: 'self-only',
  selector: '.menu-overlay-buttons button',
})

SpatialNavigation.add({
  defaultElement: '.menu-overlay-button-details button:first-child',
  enterTo: 'default-element',
  id: 'menu-overlay-button-details',
  leaveFor: { down: '', left: '@menu-overlay-buttons', right: '', up: '' },
  selector: '.menu-overlay-button-details button',
})

SpatialNavigation.add({
  enterTo: 'default-element',
  id: 'modal',
  leaveFor: { down: '', left: '', right: '', up: '' },
  selector: '.modal button, .modal a',
})

SpatialNavigation.add({
  enterTo: 'default-element',
  id: 'canvas',
  leaveFor: { down: '', left: '', right: '', up: '' },
  selector: '#canvas',
})

SpatialNavigation.add({
  enterTo: 'default-element',
  id: 'intro',
  leaveFor: { down: '', left: '', right: '', up: '' },
  selector: '.intro button',
})

function getCurrentFocusedElement() {
  const { activeElement, body } = document
  if (activeElement && activeElement !== body) {
    return activeElement as HTMLButtonElement
  }
}

onPress('left', () => {
  if (getCurrentFocusedElement()) {
    SpatialNavigation.move('left')
  } else {
    SpatialNavigation.focus()
  }
})

onPress('right', () => {
  if (getCurrentFocusedElement()) {
    SpatialNavigation.move('right')
  } else {
    SpatialNavigation.focus()
  }
})

onPress('up', () => {
  if (getCurrentFocusedElement()) {
    SpatialNavigation.move('up')
  } else {
    SpatialNavigation.focus()
  }
})

onPress('down', () => {
  if (getCurrentFocusedElement()) {
    SpatialNavigation.move('down')
  } else {
    SpatialNavigation.focus()
  }
})

onConfirm(() => {
  getCurrentFocusedElement()?.click?.()
})

export { SpatialNavigation }
