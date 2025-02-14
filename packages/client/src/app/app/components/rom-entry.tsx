import Link from 'next/link'

export function RomEntry({ rom }: { rom: any }) {
  const name = rom.fbneo_game_info?.fullName || rom.libretro_rdb?.name || rom.good_code?.rom
  return <Link href={`/app/rom/${rom.id}`}>{name}</Link>
}
