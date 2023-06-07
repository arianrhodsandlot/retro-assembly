import { atom } from 'jotai'

export const onSetupAtom = atom<null | (() => void)>(null)
