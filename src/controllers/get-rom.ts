import { getRoms } from './get-roms.ts'

export async function getRom(id: string) {
  const roms = await getRoms({ id })
  return roms.at(0)
}
