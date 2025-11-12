import { Player } from './player.js'

export interface Game {
  currentPlayer?: string | number
  idGame: number | string
  roomIndex: number | string
  players: Player[]
}
