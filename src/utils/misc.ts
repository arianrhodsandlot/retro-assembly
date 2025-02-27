import { customAlphabet } from 'nanoid'
import nanoidDictionary from 'nanoid-dictionary'

export const nanoid = customAlphabet(nanoidDictionary.nolookalikes, 10)
