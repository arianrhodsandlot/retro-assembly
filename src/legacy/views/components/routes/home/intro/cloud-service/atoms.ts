import { atom } from 'jotai'
import type { TreeNode } from './types'

export const directoyTreeAtom = atom<TreeNode | undefined>(undefined)
