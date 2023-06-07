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
export const groupedRomsAtom = atom<Record<string, Rom[]>>({})
export const currentSystemRomsAtom = atom((get) => get(groupedRomsAtom)[get(currentSystemNameAtom)])
export const systemsAtom = atom((get) => {
  const groupedRoms = get(groupedRomsAtom)
  const navSystems = allSystems
    .filter((system) => groupedRoms?.[system.name]?.length)
    .sort((a, b) => (systemNamesSorted.indexOf(a.name) > systemNamesSorted.indexOf(b.name) ? 1 : -1))
  return navSystems ?? []
})
