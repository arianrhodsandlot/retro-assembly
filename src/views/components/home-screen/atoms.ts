import { atom } from 'jotai'
import { type Rom, type SystemName } from '../../../core'

export const currentSystemNameAtom = atom('')
export const currentRomsAtom = atom<Rom[]>([])
export const systemsAtom = atom<{ name: SystemName; fullName: string }[]>([])
