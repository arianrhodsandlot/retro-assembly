import { parse } from 'goodcodes-parser'
import { capitalize } from 'lodash-es'
import { systemFullNameMap } from './constants'

export function getCover({ system, name, type = system === 'gw' ? 'snap' : 'title' }) {
  if (!name || !system) {
    return ''
  }
  const systemFullName = systemFullNameMap[system]
  if (!systemFullName) {
    return ''
  }

  const typeUrlPart = `Named_${capitalize(type)}s`
  return `https://thumbnails.libretro.com/${encodeURIComponent(systemFullName)}/${encodeURIComponent(
    typeUrlPart
  )}/${encodeURIComponent(name)}.png`
}

export function parseGoodCode(name: string) {
  return parse(`0 - ${name}`)
}
