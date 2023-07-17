/* eslint-disabled disable eslint entirely since this is a vendor file */
// @ts-nocheck
let $

/*
 * A javascript-based implementation of Spatial Navigation.
 *
 * Copyright (c) 2022 Luke Chang.
 * https://github.com/luke-chang/js-spatial-navigation
 *
 * Licensed under the MPL 2.0.
 */

/************************/
/* Global Configuration */
/************************/
// Note: an <extSelector> can be one of following types:
// - a valid selector string for "querySelectorAll" or jQuery (if it exists)
// - a NodeList or an array containing DOM elements
// - a single DOM element
// - a jQuery object
// - a string "@<sectionId>" to indicate the specified section
// - a string "@" to indicate the default section
const GlobalConfig = {
  selector: '', // can be a valid <extSelector> except "@" syntax.
  straightOnly: false,
  straightOverlapThreshold: 0.5,
  rememberSource: false,
  disabled: false,
  defaultElement: '', // <extSelector> except "@" syntax.
  enterTo: '', // '', 'last-focused', 'default-element'
  leaveFor: null, // {left: <extSelector>, right: <extSelector>,
  //  up: <extSelector>, down: <extSelector>}
  restrict: 'self-first', // 'self-first', 'self-only', 'none'
  tabIndexIgnoreList: 'a, input, select, textarea, button, iframe, [contentEditable=true]',
  navigableFilter: null,
}

/*********************/
/* Constant Variable */
/*********************/
const KEYMAPPING = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

const REVERSE = {
  left: 'right',
  up: 'down',
  right: 'left',
  down: 'up',
}

const EVENT_PREFIX = 'sn:'
const ID_POOL_PREFIX = 'section-'

/********************/
/* Private Variable */
/********************/
let _idPool = 0
let _ready = false
let _pause = false
let _sections = {}
let _sectionCount = 0
let _defaultSectionId = ''
let _lastSectionId = ''
let _duringFocusChange = false

/************/
/* Polyfill */
/************/
const elementMatchesSelector =
  Element.prototype.matches ||
  Element.prototype.matchesSelector ||
  Element.prototype.mozMatchesSelector ||
  Element.prototype.webkitMatchesSelector ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.oMatchesSelector ||
  function (selector) {
    const matchedNodes = (this.parentNode || this.document).querySelectorAll(selector)
    return Array.prototype.slice.call(matchedNodes).includes(this)
  }

/*****************/
/* Core Function */
/*****************/
function getRect(elem) {
  const cr = elem.getBoundingClientRect()
  const rect = {
    left: cr.left,
    top: cr.top,
    right: cr.right,
    bottom: cr.bottom,
    width: cr.width,
    height: cr.height,
  }
  rect.element = elem
  rect.center = {
    x: rect.left + Math.floor(rect.width / 2),
    y: rect.top + Math.floor(rect.height / 2),
  }
  rect.center.left = rect.center.right = rect.center.x
  rect.center.top = rect.center.bottom = rect.center.y
  return rect
}

function partition(rects, targetRect, straightOverlapThreshold) {
  const groups = [[], [], [], [], [], [], [], [], []]

  for (const rect of rects) {
    const { center, top, left, right, bottom } = rect
    let x, y

    if (center.x < targetRect.left) {
      x = 0
    } else if (center.x <= targetRect.right) {
      x = 1
    } else {
      x = 2
    }

    if (center.y < targetRect.top) {
      y = 0
    } else if (center.y <= targetRect.bottom) {
      y = 1
    } else {
      y = 2
    }

    const groupId = y * 3 + x
    groups[groupId].push(rect)

    if ([0, 2, 6, 8].includes(groupId)) {
      const threshold = straightOverlapThreshold

      if (left <= targetRect.right - targetRect.width * threshold) {
        if (groupId === 2) {
          groups[1].push(rect)
        } else if (groupId === 8) {
          groups[7].push(rect)
        }
      }

      if (right >= targetRect.left + targetRect.width * threshold) {
        if (groupId === 0) {
          groups[1].push(rect)
        } else if (groupId === 6) {
          groups[7].push(rect)
        }
      }

      if (top <= targetRect.bottom - targetRect.height * threshold) {
        if (groupId === 6) {
          groups[3].push(rect)
        } else if (groupId === 8) {
          groups[5].push(rect)
        }
      }

      if (bottom >= targetRect.top + targetRect.height * threshold) {
        if (groupId === 0) {
          groups[3].push(rect)
        } else if (groupId === 2) {
          groups[5].push(rect)
        }
      }
    }
  }

  return groups
}

function generateDistanceFunction(targetRect) {
  return {
    nearPlumbLineIsBetter(rect) {
      const d = rect.center.x < targetRect.center.x ? targetRect.center.x - rect.right : rect.left - targetRect.center.x
      return d < 0 ? 0 : d
    },
    nearHorizonIsBetter(rect) {
      const d = rect.center.y < targetRect.center.y ? targetRect.center.y - rect.bottom : rect.top - targetRect.center.y
      return d < 0 ? 0 : d
    },
    nearTargetLeftIsBetter(rect) {
      const d = rect.center.x < targetRect.center.x ? targetRect.left - rect.right : rect.left - targetRect.left
      return d < 0 ? 0 : d
    },
    nearTargetTopIsBetter(rect) {
      const d = rect.center.y < targetRect.center.y ? targetRect.top - rect.bottom : rect.top - targetRect.top
      return d < 0 ? 0 : d
    },
    topIsBetter(rect) {
      return rect.top
    },
    bottomIsBetter(rect) {
      return -1 * rect.bottom
    },
    leftIsBetter(rect) {
      return rect.left
    },
    rightIsBetter(rect) {
      return -1 * rect.right
    },
  }
}

function prioritize(priorities) {
  let destPriority = null
  for (const priority of priorities) {
    if (priority.group.length > 0) {
      destPriority = priority
      break
    }
  }

  if (!destPriority) {
    return null
  }

  const destDistance = destPriority.distance

  destPriority.group.sort(function (a, b) {
    for (const distance of destDistance) {
      const delta = distance(a) - distance(b)
      if (delta) {
        return delta
      }
    }
    return 0
  })

  return destPriority.group
}

function navigate(target, direction, candidates, config) {
  if (!target || !direction || !candidates || candidates.length === 0) {
    return null
  }

  const rects = []
  for (const candidate of candidates) {
    const rect = getRect(candidate)
    if (rect) {
      rects.push(rect)
    }
  }
  if (rects.length === 0) {
    return null
  }

  const targetRect = getRect(target)
  if (!targetRect) {
    return null
  }

  const distanceFunction = generateDistanceFunction(targetRect)

  const groups = partition(rects, targetRect, config.straightOverlapThreshold)

  const internalGroups = partition(groups[4], targetRect.center, config.straightOverlapThreshold)

  let priorities

  switch (direction) {
    case 'left':
      priorities = [
        {
          group: internalGroups[0].concat(internalGroups[3]).concat(internalGroups[6]),
          distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter],
        },
        {
          group: groups[3],
          distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter],
        },
        {
          group: groups[0].concat(groups[6]),
          distance: [
            distanceFunction.nearHorizonIsBetter,
            distanceFunction.rightIsBetter,
            distanceFunction.nearTargetTopIsBetter,
          ],
        },
      ]
      break
    case 'right':
      priorities = [
        {
          group: internalGroups[2].concat(internalGroups[5]).concat(internalGroups[8]),
          distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter],
        },
        {
          group: groups[5],
          distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter],
        },
        {
          group: groups[2].concat(groups[8]),
          distance: [
            distanceFunction.nearHorizonIsBetter,
            distanceFunction.leftIsBetter,
            distanceFunction.nearTargetTopIsBetter,
          ],
        },
      ]
      break
    case 'up':
      priorities = [
        {
          group: internalGroups[0].concat(internalGroups[1]).concat(internalGroups[2]),
          distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter],
        },
        {
          group: groups[1],
          distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter],
        },
        {
          group: groups[0].concat(groups[2]),
          distance: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.bottomIsBetter,
            distanceFunction.nearTargetLeftIsBetter,
          ],
        },
      ]
      break
    case 'down':
      priorities = [
        {
          group: internalGroups[6].concat(internalGroups[7]).concat(internalGroups[8]),
          distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter],
        },
        {
          group: groups[7],
          distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter],
        },
        {
          group: groups[6].concat(groups[8]),
          distance: [
            distanceFunction.nearPlumbLineIsBetter,
            distanceFunction.topIsBetter,
            distanceFunction.nearTargetLeftIsBetter,
          ],
        },
      ]
      break
    default:
      return null
  }

  if (config.straightOnly) {
    priorities.pop()
  }

  const destGroup = prioritize(priorities)
  if (!destGroup) {
    return null
  }

  let dest = null
  if (
    config.rememberSource &&
    config.previous &&
    config.previous.destination === target &&
    config.previous.reverse === direction
  ) {
    for (const element of destGroup) {
      if (element.element === config.previous.target) {
        dest = element.element
        break
      }
    }
  }

  if (!dest) {
    dest = destGroup[0].element
  }

  return dest
}

/********************/
/* Private Function */
/********************/
function generateId() {
  let id
  while (true) {
    id = ID_POOL_PREFIX + String(++_idPool)
    if (!_sections[id]) {
      break
    }
  }
  return id
}

function parseSelector(selector) {
  let result = []
  try {
    if (selector) {
      if ($) {
        result = $(selector).get()
      } else if (typeof selector === 'string') {
        result = Array.prototype.slice.call(document.querySelectorAll(selector))
      } else if (typeof selector === 'object' && selector.length > 0) {
        result = Array.prototype.slice.call(selector)
      } else if (typeof selector === 'object' && selector.nodeType === 1) {
        result = [selector]
      }
    }
  } catch (error) {
    console.error(error)
  }
  return result
}

function matchSelector(elem, selector) {
  if ($) {
    return $(elem).is(selector)
  }
  if (typeof selector === 'string') {
    return elementMatchesSelector.call(elem, selector)
  }
  if (typeof selector === 'object' && selector.length > 0) {
    return selector.includes(elem)
  }
  if (typeof selector === 'object' && selector.nodeType === 1) {
    return elem === selector
  }
  return false
}

function getCurrentFocusedElement() {
  const { activeElement, body } = document
  if (activeElement && activeElement !== body) {
    return activeElement
  }
}

function extend(out) {
  out = out || {}
  for (let i = 1; i < arguments.length; i++) {
    if (!arguments[i]) {
      continue
    }
    for (const key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key) && arguments[i][key] !== undefined) {
        out[key] = arguments[i][key]
      }
    }
  }
  return out
}

function exclude(elemList, excludedElem) {
  if (!Array.isArray(excludedElem)) {
    excludedElem = [excludedElem]
  }
  for (let i = 0, index; i < excludedElem.length; i++) {
    index = elemList.indexOf(excludedElem[i])
    if (index >= 0) {
      elemList.splice(index, 1)
    }
  }
  return elemList
}

function isNavigable(elem, sectionId, verifySectionSelector) {
  if (!elem || !sectionId || !_sections[sectionId] || _sections[sectionId].disabled) {
    return false
  }
  if ((elem.offsetWidth <= 0 && elem.offsetHeight <= 0) || elem.hasAttribute('disabled')) {
    return false
  }
  if (verifySectionSelector && !matchSelector(elem, _sections[sectionId].selector)) {
    return false
  }
  if (typeof _sections[sectionId].navigableFilter === 'function') {
    if (_sections[sectionId].navigableFilter(elem, sectionId) === false) {
      return false
    }
  } else if (
    typeof GlobalConfig.navigableFilter === 'function' &&
    GlobalConfig.navigableFilter(elem, sectionId) === false
  ) {
    return false
  }
  return true
}

function getSectionId(elem) {
  for (const id in _sections) {
    if (!_sections[id].disabled && matchSelector(elem, _sections[id].selector)) {
      return id
    }
  }
}

function getSectionNavigableElements(sectionId) {
  return parseSelector(_sections[sectionId].selector).filter(function (elem) {
    return isNavigable(elem, sectionId)
  })
}

function getSectionDefaultElement(sectionId) {
  const defaultElement = parseSelector(_sections[sectionId].defaultElement).find(function (elem) {
    return isNavigable(elem, sectionId, true)
  })
  if (!defaultElement) {
    return null
  }
  return defaultElement
}

function getSectionLastFocusedElement(sectionId) {
  const { lastFocusedElement } = _sections[sectionId]
  if (!isNavigable(lastFocusedElement, sectionId, true)) {
    return null
  }
  return lastFocusedElement
}

function fireEvent(elem, type, details, cancelable) {
  if (arguments.length < 4) {
    cancelable = true
  }
  const evt = document.createEvent('CustomEvent')
  evt.initCustomEvent(EVENT_PREFIX + type, true, cancelable, details)
  return elem.dispatchEvent(evt)
}

function focusElement(elem, sectionId, direction) {
  if (!elem) {
    return false
  }

  const currentFocusedElement = getCurrentFocusedElement()

  function silentFocus() {
    if (currentFocusedElement) {
      currentFocusedElement.blur()
    }
    elem.focus()
    focusChanged(elem, sectionId)
  }

  if (_duringFocusChange) {
    silentFocus()
    return true
  }

  _duringFocusChange = true

  if (_pause) {
    silentFocus()
    _duringFocusChange = false
    return true
  }

  if (currentFocusedElement) {
    const unfocusProperties = {
      nextElement: elem,
      nextSectionId: sectionId,
      direction,
      native: false,
    }
    if (!fireEvent(currentFocusedElement, 'willunfocus', unfocusProperties)) {
      _duringFocusChange = false
      return false
    }
    currentFocusedElement.blur()
    fireEvent(currentFocusedElement, 'unfocused', unfocusProperties, false)
  }

  const focusProperties = {
    previousElement: currentFocusedElement,
    sectionId,
    direction,
    native: false,
  }
  if (!fireEvent(elem, 'willfocus', focusProperties)) {
    _duringFocusChange = false
    return false
  }
  elem.focus()
  fireEvent(elem, 'focused', focusProperties, false)

  _duringFocusChange = false

  focusChanged(elem, sectionId)
  return true
}

function focusChanged(elem, sectionId) {
  if (!sectionId) {
    sectionId = getSectionId(elem)
  }
  if (sectionId) {
    _sections[sectionId].lastFocusedElement = elem
    _lastSectionId = sectionId
  }
}

function focusExtendedSelector(selector, direction) {
  if (selector.charAt(0) === '@') {
    if (selector.length === 1) {
      return focusSection()
    }
    const sectionId = selector.slice(1)
    return focusSection(sectionId)
  }
  const next = parseSelector(selector)[0]
  if (next) {
    const nextSectionId = getSectionId(next)
    if (isNavigable(next, nextSectionId)) {
      return focusElement(next, nextSectionId, direction)
    }
  }

  return false
}

export function focusSection(sectionId) {
  const range = []
  function addRange(id) {
    if (id && !range.includes(id) && _sections[id] && !_sections[id].disabled) {
      range.push(id)
    }
  }

  if (sectionId) {
    addRange(sectionId)
  } else {
    addRange(_defaultSectionId)
    addRange(_lastSectionId)
    Object.keys(_sections).map(addRange)
  }

  for (const id of range) {
    const next =
      _sections[id].enterTo === 'last-focused'
        ? getSectionLastFocusedElement(id) || getSectionDefaultElement(id) || getSectionNavigableElements(id)[0]
        : getSectionDefaultElement(id) || getSectionLastFocusedElement(id) || getSectionNavigableElements(id)[0]
    if (next) {
      return focusElement(next, id)
    }
  }

  return false
}

function fireNavigatefailed(elem, direction) {
  fireEvent(
    elem,
    'navigatefailed',
    {
      direction,
    },
    false,
  )
}

function gotoLeaveFor(sectionId, direction) {
  if (_sections[sectionId].leaveFor?.[direction] !== undefined) {
    let next = _sections[sectionId].leaveFor[direction]

    if (typeof next === 'string') {
      if (next === '') {
        return null
      }
      return focusExtendedSelector(next, direction)
    }

    if ($ && next instanceof $) {
      next = next.get(0)
    }

    const nextSectionId = getSectionId(next)
    if (isNavigable(next, nextSectionId)) {
      return focusElement(next, nextSectionId, direction)
    }
  }
  return false
}

function focusNext(direction, currentFocusedElement, currentSectionId) {
  const extSelector = currentFocusedElement.getAttribute(`data-sn-${direction}`)
  if (typeof extSelector === 'string') {
    if (extSelector === '' || !focusExtendedSelector(extSelector, direction)) {
      fireNavigatefailed(currentFocusedElement, direction)
      return false
    }
    return true
  }

  const sectionNavigableElements = {}
  let allNavigableElements = []
  for (const id in _sections) {
    sectionNavigableElements[id] = getSectionNavigableElements(id)
    allNavigableElements = allNavigableElements.concat(sectionNavigableElements[id])
  }

  const config = extend({}, GlobalConfig, _sections[currentSectionId])
  let next

  if (config.restrict === 'self-only' || config.restrict === 'self-first') {
    const currentSectionNavigableElements = sectionNavigableElements[currentSectionId]

    next = navigate(
      currentFocusedElement,
      direction,
      exclude(currentSectionNavigableElements, currentFocusedElement),
      config,
    )

    if (!next && config.restrict === 'self-first') {
      next = navigate(
        currentFocusedElement,
        direction,
        exclude(allNavigableElements, currentSectionNavigableElements),
        config,
      )
    }
  } else {
    next = navigate(currentFocusedElement, direction, exclude(allNavigableElements, currentFocusedElement), config)
  }

  if (next) {
    _sections[currentSectionId].previous = {
      target: currentFocusedElement,
      destination: next,
      reverse: REVERSE[direction],
    }

    const nextSectionId = getSectionId(next)

    if (currentSectionId !== nextSectionId) {
      const result = gotoLeaveFor(currentSectionId, direction)
      if (result) {
        return true
      }
      if (result === null) {
        fireNavigatefailed(currentFocusedElement, direction)
        return false
      }

      let enterToElement
      switch (_sections[nextSectionId].enterTo) {
        case 'last-focused':
          enterToElement = getSectionLastFocusedElement(nextSectionId) || getSectionDefaultElement(nextSectionId)
          break
        case 'default-element':
          enterToElement = getSectionDefaultElement(nextSectionId)
          break
      }
      if (enterToElement) {
        next = enterToElement
      }
    }

    return focusElement(next, nextSectionId, direction)
  }
  if (gotoLeaveFor(currentSectionId, direction)) {
    return true
  }

  fireNavigatefailed(currentFocusedElement, direction)
  return false
}

function onKeyDown(evt) {
  if (!_sectionCount || _pause || evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) {
    return
  }

  let currentFocusedElement
  function preventDefault() {
    evt.preventDefault()
    evt.stopPropagation()
    return false
  }

  const direction = KEYMAPPING[evt.keyCode]
  if (!direction) {
    if (evt.keyCode == 13) {
      currentFocusedElement = getCurrentFocusedElement()
      if (
        currentFocusedElement &&
        getSectionId(currentFocusedElement) &&
        !fireEvent(currentFocusedElement, 'enter-down')
      ) {
        return preventDefault()
      }
    }
    return
  }

  currentFocusedElement = getCurrentFocusedElement()

  if (!currentFocusedElement) {
    if (_lastSectionId) {
      currentFocusedElement = getSectionLastFocusedElement(_lastSectionId)
    }
    if (!currentFocusedElement) {
      focusSection()
      return preventDefault()
    }
  }

  const currentSectionId = getSectionId(currentFocusedElement)
  if (!currentSectionId) {
    return
  }

  const willmoveProperties = {
    direction,
    sectionId: currentSectionId,
    cause: 'keydown',
  }

  if (fireEvent(currentFocusedElement, 'willmove', willmoveProperties)) {
    focusNext(direction, currentFocusedElement, currentSectionId)
  }

  return preventDefault()
}

function onKeyUp(evt) {
  if (evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) {
    return
  }
  if (!_pause && _sectionCount && evt.keyCode == 13) {
    const currentFocusedElement = getCurrentFocusedElement()
    if (currentFocusedElement && getSectionId(currentFocusedElement) && !fireEvent(currentFocusedElement, 'enter-up')) {
      evt.preventDefault()
      evt.stopPropagation()
    }
  }
}

function onFocus(evt) {
  const { target } = evt
  if (target !== window && target !== document && _sectionCount && !_duringFocusChange) {
    const sectionId = getSectionId(target)
    if (sectionId) {
      if (_pause) {
        focusChanged(target, sectionId)
        return
      }

      const focusProperties = {
        sectionId,
        native: true,
      }

      if (fireEvent(target, 'willfocus', focusProperties)) {
        fireEvent(target, 'focused', focusProperties, false)
        focusChanged(target, sectionId)
      } else {
        _duringFocusChange = true
        target.blur()
        _duringFocusChange = false
      }
    }
  }
}

function onBlur(evt) {
  const { target } = evt
  if (
    target !== window &&
    target !== document &&
    !_pause &&
    _sectionCount &&
    !_duringFocusChange &&
    getSectionId(target)
  ) {
    const unfocusProperties = {
      native: true,
    }
    if (fireEvent(target, 'willunfocus', unfocusProperties)) {
      fireEvent(target, 'unfocused', unfocusProperties, false)
    } else {
      _duringFocusChange = true
      setTimeout(function () {
        target.focus()
        _duringFocusChange = false
      })
    }
  }
}

function doMakeFocusable(section) {
  const tabIndexIgnoreList =
    section.tabIndexIgnoreList === undefined ? GlobalConfig.tabIndexIgnoreList : section.tabIndexIgnoreList
  for (const elem of parseSelector(section.selector)) {
    if (!matchSelector(elem, tabIndexIgnoreList) && !elem.getAttribute('tabindex')) {
      elem.setAttribute('tabindex', '-1')
    }
  }
}

/*******************/
/* Public Function */
/*******************/
export const SpatialNavigation = {
  init() {
    if (!_ready) {
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
      window.addEventListener('focus', onFocus, true)
      window.addEventListener('blur', onBlur, true)
      _ready = true
    }
  },

  uninit() {
    window.removeEventListener('blur', onBlur, true)
    window.removeEventListener('focus', onFocus, true)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('keydown', onKeyDown)
    SpatialNavigation.clear()
    _idPool = 0
    _ready = false
  },

  clear() {
    _sections = {}
    _sectionCount = 0
    _defaultSectionId = ''
    _lastSectionId = ''
    _duringFocusChange = false
  },

  // set(<config>);
  // set(<sectionId>, <config>);
  set(...args) {
    let sectionId, config

    if (typeof args[0] === 'object') {
      config = args[0]
    } else if (typeof args[0] === 'string' && typeof args[1] === 'object') {
      sectionId = args[0]
      config = args[1]
      if (!_sections[sectionId]) {
        throw new Error(`Section "${sectionId}" doesn't exist!`)
      }
    } else {
      return
    }

    for (const key in config) {
      if (GlobalConfig[key] !== undefined) {
        if (sectionId) {
          _sections[sectionId][key] = config[key]
        } else if (config[key] !== undefined) {
          GlobalConfig[key] = config[key]
        }
      }
    }

    if (sectionId) {
      // remove "undefined" items
      _sections[sectionId] = extend({}, _sections[sectionId])
    }
  },

  // add(<config>);
  // add(<sectionId>, <config>);
  add(...args) {
    let sectionId
    let config = {}

    if (typeof args[0] === 'object') {
      config = args[0]
    } else if (typeof args[0] === 'string' && typeof args[1] === 'object') {
      sectionId = args[0]
      config = args[1]
    }

    if (!sectionId) {
      sectionId = typeof config.id === 'string' ? config.id : generateId()
    }

    if (_sections[sectionId]) {
      throw new Error(`Section "${sectionId}" has already existed!`)
    }

    _sections[sectionId] = {}
    _sectionCount++

    SpatialNavigation.set(sectionId, config)

    return sectionId
  },

  remove(sectionId) {
    if (!sectionId || typeof sectionId !== 'string') {
      throw new Error('Please assign the "sectionId"!')
    }
    if (_sections[sectionId]) {
      _sections[sectionId] = undefined
      _sections = extend({}, _sections)
      _sectionCount--
      if (_lastSectionId === sectionId) {
        _lastSectionId = ''
      }
      return true
    }
    return false
  },

  disable(sectionId) {
    if (_sections[sectionId]) {
      _sections[sectionId].disabled = true
      return true
    }
    return false
  },

  enable(sectionId) {
    if (_sections[sectionId]) {
      _sections[sectionId].disabled = false
      return true
    }
    return false
  },

  pause() {
    _pause = true
  },

  resume() {
    _pause = false
  },

  // focus([silent])
  // focus(<sectionId>, [silent])
  // focus(<extSelector>, [silent])
  // Note: "silent" is optional and default to false
  focus(elem?, silent?) {
    let result = false

    if (silent === undefined && typeof elem === 'boolean') {
      silent = elem
      elem = undefined
    }

    const autoPause = !_pause && silent

    if (autoPause) {
      SpatialNavigation.pause()
    }

    if (elem) {
      if (typeof elem === 'string') {
        result = _sections[elem] ? focusSection(elem) : focusExtendedSelector(elem)
      } else {
        if ($ && elem instanceof $) {
          elem = elem.get(0)
        }

        const nextSectionId = getSectionId(elem)
        if (isNavigable(elem, nextSectionId)) {
          result = focusElement(elem, nextSectionId)
        }
      }
    } else {
      result = focusSection()
    }

    if (autoPause) {
      SpatialNavigation.resume()
    }

    return result
  },

  // move(<direction>)
  // move(<direction>, <selector>)
  move(direction, selector?) {
    direction = direction.toLowerCase()
    if (!REVERSE[direction]) {
      return false
    }

    const elem = selector ? parseSelector(selector)[0] : getCurrentFocusedElement()
    if (!elem) {
      return false
    }

    const sectionId = getSectionId(elem)
    if (!sectionId) {
      return false
    }

    const willmoveProperties = {
      direction,
      sectionId,
      cause: 'api',
    }

    if (!fireEvent(elem, 'willmove', willmoveProperties)) {
      return false
    }

    return focusNext(direction, elem, sectionId)
  },

  // makeFocusable()
  // makeFocusable(<sectionId>)
  makeFocusable(sectionId) {
    if (sectionId) {
      if (_sections[sectionId]) {
        doMakeFocusable(_sections[sectionId])
      } else {
        throw new Error(`Section "${sectionId}" doesn't exist!`)
      }
    } else {
      for (const id in _sections) {
        doMakeFocusable(_sections[id])
      }
    }
  },

  setDefaultSection(sectionId) {
    if (!sectionId) {
      _defaultSectionId = ''
    } else if (_sections[sectionId]) {
      _defaultSectionId = sectionId
    } else {
      throw new Error(`Section "${sectionId}" doesn't exist!`)
    }
  },
}
/* eslint-enabled */
