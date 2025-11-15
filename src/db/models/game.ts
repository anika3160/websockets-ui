import { Id } from './common.js'
import { Player } from './player.js'

export type Coordinates = {
  x: number
  y: number
}

export interface Game {
  currentPlayer?: Id
  idGame: Id
  roomIndex: Id
  players: Player[]
  attackedPositions?: Record<string, Set<string>>
  isFinished?: boolean
  winnerPlayerId?: Id
  winnerUserId?: Id
}
