import { atom } from 'jotai'
import type { MouseEvent } from 'react'
import type { Rom } from '../../../../core'

interface MaskAtomValue {
  event?: MouseEvent<HTMLButtonElement>
  rom?: Rom
  target?: HTMLButtonElement
}
export const launchingMaskAtom = atom<MaskAtomValue | undefined>(undefined)
export const needsUserInteractionAtom = atom(true)
export const launchingFromHistoryAtom = atom(false)
