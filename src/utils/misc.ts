import { getContext } from 'hono/context-storage'
import { customAlphabet } from 'nanoid'
import nanoidDictionary from 'nanoid-dictionary'
import { getHonoContext } from 'waku/unstable_hono'

export const nanoid = customAlphabet(nanoidDictionary.nolookalikes, 10)

export function restoreTitleForSorting(title: string) {
  // Match titles ending with ", A", ", An", or ", The" followed by optional additional info
  // eslint-disable-next-line security/detect-unsafe-regex
  const match = title.match(/^(.*),\s*(A|An|The)(\s*(?:\S.*)?)$/)
  if (match) {
    // Reconstruct: article + space + main title + additional info
    return `${match[2]} ${match[1]}${match[3]}`
  }
  // Return original string if no match
  return title
}

export function getC() {
  try {
    return getContext()
  } catch {
    return getHonoContext()
  }
}
