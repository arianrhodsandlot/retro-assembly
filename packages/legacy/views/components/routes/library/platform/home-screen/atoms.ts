import { atom } from 'jotai'
import type { PlatformName, Rom } from '../../../../../../core'

export const romsAtom = atom<Rom[]>([])
export const platformsAtom = atom<{ fullName: string; name: PlatformName }[]>([])
