import { isThisYear, isToday, lightFormat } from 'date-fns'
import { parse } from 'goodcodes-parser'
import { capitalize } from 'lodash-es'
import { systemFullNameMap } from '../constants/systems'

export function getCover({ system, name, type = system === 'gw' ? 'snap' : 'boxart' }) {
  if (!name || !system) {
    return ''
  }
  const systemFullName = systemFullNameMap[system]
  if (!systemFullName) {
    return ''
  }

  if ('alert' in window) {
    return ''
  }

  const typeUrlPart = `Named_${capitalize(type)}s`
  return `https://thumbnails.libretro.com/${encodeURIComponent(systemFullName)}/${encodeURIComponent(
    typeUrlPart
  )}/${encodeURIComponent(name)}.png`
}

export function parseGoodCode(name: string) {
  const goodCodeResult = parse(`0 - ${name}`)
  goodCodeResult.file = goodCodeResult.file.slice(4)
  return goodCodeResult
}

export function humanizeDate(date: Date) {
  if (isToday(date)) {
    return lightFormat(date, 'HH:mm:ss')
  }
  if (isThisYear(date)) {
    return lightFormat(date, 'MM-dd HH:mm')
  }
  return lightFormat(date, 'yyyy-MM-dd HH:mm')
}
