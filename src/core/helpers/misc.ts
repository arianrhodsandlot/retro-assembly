import { isThisYear, isToday, lightFormat } from 'date-fns'
import { parse } from 'goodcodes-parser'
import { capitalize } from 'lodash-es'
import { cdnHost } from '../constants/dependencies'
import { systemFullNameMap } from '../constants/systems'

function encodeRFC3986URIComponent(str) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export function getCover({ system, name, type = 'boxart' }) {
  if (!name || !system) {
    return ''
  }
  const systemFullName = systemFullNameMap[system]
  if (!systemFullName) {
    return ''
  }

  const typeUrlPart = `Named_${capitalize(type)}s`
  const normalizedSystemFullName = systemFullName.replaceAll(' ', '_')
  const pathPrefix = `gh/libretro-thumbnails/${normalizedSystemFullName}@master`
  const normalizedFileName = name.replaceAll(/&|\*|\/|:|`|<|>|\?|\\|\|"/g, '_')
  const encode = encodeRFC3986URIComponent
  return `${cdnHost}/${pathPrefix}/${encode(typeUrlPart)}/${encode(normalizedFileName)}.png`
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
