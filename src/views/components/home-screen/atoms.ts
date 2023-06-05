import { atom } from 'jotai'
import { type Rom } from '../../../core'

export const currentSystemNameAtom = atom('')
export const groupedRomsAtom = atom<Record<string, Rom[]>>({})
export const currentSystemRomsAtom = atom((get) => get(groupedRomsAtom)[get(currentSystemNameAtom)])
