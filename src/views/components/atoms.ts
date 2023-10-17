import { atom } from 'jotai'

export const isGameRunningAtom = atom(false)
export const isGameLaunchingAtom = atom(false)
export const isGameLaunchedAtom = atom((get) => get(isGameRunningAtom) && !get(isGameLaunchingAtom))
export const isGameIdleAtom = atom((get) => !get(isGameRunningAtom) && !get(isGameLaunchingAtom))
export const showMenuOverlayAtom = atom(false)
