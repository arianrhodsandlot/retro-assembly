import { atom } from 'jotai'
import { type PlatformName, type Rom } from '../../../../../../core'

export const romsAtom = atom<Rom[]>([])
export const platformsAtom = atom<{ name: PlatformName; fullName: string }[]>([])
