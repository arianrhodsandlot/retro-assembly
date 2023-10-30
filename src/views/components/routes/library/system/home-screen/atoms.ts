import { atom } from 'jotai'
import { type Rom, type SystemName } from '../../../../../../core'

export const romsAtom = atom<Rom[]>([])
export const systemsAtom = atom<{ name: SystemName; fullName: string }[]>([])
