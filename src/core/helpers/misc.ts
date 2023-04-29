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
