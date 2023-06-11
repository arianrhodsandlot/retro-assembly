import { ui } from '../../../core'
import { SpatialNavigation } from './js-spatial-navigation'

SpatialNavigation.init()

SpatialNavigation.add({
  id: 'sidebar',
  selector: '.sidebar button',
  enterTo: 'last-focused',
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
  leaveFor: { up: '', down: '', left: '', right: '@menu-overlay-button-details' },
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
  selector: '.modal button',
  enterTo: 'default-element',
  defaultElement: '.modal button:first-child',
  leaveFor: { up: '', down: '', left: '', right: '' },
})

function getCurrentFocusedElement() {
  const { activeElement, body } = document
  if (activeElement && activeElement !== body) {
    return activeElement as HTMLButtonElement
  }
}

ui.onPressButton('left', () => {
  if (getCurrentFocusedElement()) {
    SpatialNavigation.move('left')
  } else {
    SpatialNavigation.focus()
  }
})

ui.onPressButton('right', () => {
  if (getCurrentFocusedElement()) {
    SpatialNavigation.move('right')
  } else {
    SpatialNavigation.focus()
  }
})

ui.onPressButton('up', () => {
  if (getCurrentFocusedElement()) {
    SpatialNavigation.move('up')
  } else {
    SpatialNavigation.focus()
  }
})

ui.onPressButton('down', () => {
  if (getCurrentFocusedElement()) {
    SpatialNavigation.move('down')
  } else {
    SpatialNavigation.focus()
  }
})

ui.onConfirm(() => {
  getCurrentFocusedElement()?.click?.()
})

export { SpatialNavigation }
