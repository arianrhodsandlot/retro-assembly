import { atom } from 'jotai'

export const needsFreshSetupAtom = atom(false)
export const needsRegrantLocalPermissionAtom = atom(false)

export const isSettingsModalOpenAtom = atom(false)
export const canLoadHomeScreenAtom = atom(false)

export const needsValidateSystemConfigAtom = atom(false)

export const needsShowSetupWizardAtom = atom((get) => {
  return get(needsFreshSetupAtom)
})

export const needsShowGetStartedAtom = atom((get) => {
  return get(needsFreshSetupAtom) && !get(needsRegrantLocalPermissionAtom)
})
