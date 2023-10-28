import { atari2600Games } from './atari2600-games'
import { gbaGames } from './gba-games'
import { gbcGames } from './gbc-games'
import { mdGames } from './md-games'
import { nesGames } from './nes-games'
import { snesGames } from './snes-games'

export const retrobrewsGames = {
  atari2600: atari2600Games,
  gba: gbaGames,
  gbc: gbcGames,
  megadrive: mdGames,
  nes: nesGames,
  snes: snesGames,
}
