import { isThisYear, isToday, lightFormat } from 'date-fns'
import { parse } from 'goodcodes-parser'
import { capitalize } from 'lodash-es'
import { systemFullNameMap } from '../constants/systems'

function encodeRFC3986URIComponent(str) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export function getCover({ system, name, type = system === 'gw' ? 'snap' : 'boxart' }) {
  if (!name || !system) {
    return ''
  }
  const systemFullName = systemFullNameMap[system]
  if (!systemFullName) {
    return ''
  }

  const typeUrlPart = `Named_${capitalize(type)}s`
  return `https://thumbnails.libretro.com/${encodeRFC3986URIComponent(systemFullName)}/${encodeRFC3986URIComponent(
    typeUrlPart,
  )}/${encodeRFC3986URIComponent(name.replaceAll(/&|\*|\/|:|`|<|>|\?|\\|\|"/g, '_'))}.png`
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
