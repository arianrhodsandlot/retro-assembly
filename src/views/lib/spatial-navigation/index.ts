import { onConfirm, onPress } from '../../../core'
import { SpatialNavigation } from './js-spatial-navigation'

SpatialNavigation.init()

SpatialNavigation.add({
  id: 'get-started',
  selector: '.get-started button',
  enterTo: 'default-element',
  leaveFor: { up: '', down: '', left: '', right: '' },
})

SpatialNavigation.add({
  id: 'system-navigation',
  selector: '.system-navigation button',
  enterTo: 'last-focused',
})

SpatialNavigation.add({
  id: 'game-entry-grid',
  selector: '.game-entry-grid button',
  enterTo: 'last-focused',
})

SpatialNavigation.add({
  id: 'menu-overlay-buttons',
  selector: '.menu-overlay-buttons button',
  restrict: 'self-only',
  leaveFor: {
    up: '.menu-overlay-buttons button:last-child',
    down: '.menu-overlay-buttons button:first-child',
    left: '',
    right: '@menu-overlay-button-details',
  },
})

SpatialNavigation.add({
  id: 'menu-overlay-button-details',
  selector: '.menu-overlay-button-details button',
  enterTo: 'default-element',
  defaultElement: '.menu-overlay-button-details button:first-child',
  leaveFor: { up: '', down: '', left: '@menu-overlay-buttons', right: '' },
})

SpatialNavigation.add({
  id: 'modal',
  selector: '.modal button, .modal a',
  enterTo: 'default-element',
  leaveFor: { up: '', down: '', left: '', right: '' },
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
