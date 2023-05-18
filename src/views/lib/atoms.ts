import { atom } from 'jotai'
import { type Rom } from '../../core'

export const needsSetupAtom = atom(false)
export const needsGrantLocalPermissionAtom = atom(false)
export const isSettingsModalOpenAtom = atom(false)
export const canLoadHomeScreenAtom = atom(false)
export const currentRomAtom = atom<Rom | undefined>(undefined)
