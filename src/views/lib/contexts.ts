import { createContext } from 'react'
import { type Emulator } from '../../core'

export const EmulatorContext = createContext<Emulator | undefined>(undefined)
