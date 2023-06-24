import { atom } from 'jotai'

export const showMenuOverlayAtom = atom(false)
export const shouldFocusStatesListAtom = atom(false)
export const previousFocusedElementAtom = atom<HTMLElement | null>(null)
