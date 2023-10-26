import { atom } from 'jotai'
import { type MouseEvent } from 'react'
import { type Rom, type SystemName } from '../../../core'

export const romsAtom = atom<Rom[]>([])
export const systemsAtom = atom<{ name: SystemName; fullName: string }[]>([])

interface MaskAtomValue {
  event?: MouseEvent<HTMLButtonElement>
  target?: HTMLButtonElement
  rom?: Rom
}
export const maskAtom = atom<MaskAtomValue | undefined>(undefined)
