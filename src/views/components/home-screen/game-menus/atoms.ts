import { atom } from 'jotai'

export const shouldFocusStatesListAtom = atom(false)
export const previousFocusedElementAtom = atom<HTMLElement | null>(null)
