import { atom } from 'jotai'
import { type Rom, systemFullNameMap, systemNamesSorted } from '../../../core'

const allSystems = Object.entries(systemFullNameMap).map(
  ([name, fullName]) =>
    ({ name, fullName } as {
      name: keyof typeof systemFullNameMap
      fullName: string
    })
)

export const currentSystemNameAtom = atom('')
export const currentRomsAtom = atom<Rom[]>([])
export const systemsAtom = atom([])
