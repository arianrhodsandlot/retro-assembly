import { atom } from 'jotai'
import type { PlatformName, Rom } from '../../../../../../core'

export const romsAtom = atom<Rom[]>([])
export const platformsAtom = atom<{ name: PlatformName; fullName: string }[]>([])
