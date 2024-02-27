import { isThisYear, isToday, lightFormat } from 'date-fns'
import { parse } from 'goodcodes-parser'
import { capitalize } from 'lodash-es'
import { getCDNHost } from '../constants/dependencies'
import { platformFullNameMap } from '../constants/platforms'

function encodeRFC3986URIComponent(str) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export function getCover({ platform, name, type = 'boxart' }) {
  if (!name || !platform) {
    return ''
  }
  const platformFullName = platformFullNameMap[platform]
  if (!platformFullName) {
    return ''
  }

  const typeUrlPart = `Named_${capitalize(type)}s`
  const normalizedPlatformFullName = platformFullName.replaceAll(' ', '_')
  const pathPrefix = `gh/libretro-thumbnails/${normalizedPlatformFullName}@master`
  const normalizedFileName = name.replaceAll(/&|\*|\/|:|`|<|>|\?|\\|\|"/g, '_')
  const encode = encodeRFC3986URIComponent
  return `${getCDNHost()}/${pathPrefix}/${encode(typeUrlPart)}/${encode(normalizedFileName)}.png`
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

export async function getScript(url: string) {
  const script = document.createElement('script')
  script.src = url
  document.body.append(script)
  await new Promise<void>((resolve, reject) => {
    script.addEventListener('load', function () {
      resolve()
    })
    script.addEventListener('error', function (error) {
      reject(error)
    })
  })
  script.remove()
}
