import { atom } from 'jotai'
import { type Rom } from '../../../core'

export const currentSystemNameAtom = atom('')
export const currentRomsAtom = atom<Rom[]>([])
export const systemsAtom = atom([])
