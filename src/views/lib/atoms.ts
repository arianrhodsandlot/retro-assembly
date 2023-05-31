import { atom } from 'jotai'
import { type Rom } from '../../core'

export const needsFreshSetupAtom = atom(false)
export const needsRegrantLocalPermissionAtom = atom(false)

export const isSettingsModalOpenAtom = atom(false)
export const canLoadHomeScreenAtom = atom(false)
export const currentRomAtom = atom<Rom | undefined>(undefined)

export const needsValidateSystemConfigAtom = atom(false)

export const needsShowSetupWizardAtom = atom((get) => {
  return get(needsFreshSetupAtom) || get(needsRegrantLocalPermissionAtom)
})

export const needsShowGetStartedAtom = atom((get) => {
  return get(needsFreshSetupAtom) && !get(needsRegrantLocalPermissionAtom)
})
