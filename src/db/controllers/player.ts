import { Id, Player } from '../models/index.js'

let lastPlayerId = 1000

const getNextPlayerId = (): number => ++lastPlayerId

type CreatePlayerOptions = {
  isBot?: boolean
}

export const createPlayer = (userId: Id, idGame: Id, options: CreatePlayerOptions = {}): Player => ({
  userId,
  idPlayer: getNextPlayerId(),
  idGame,
  ships: [],
  ...options,
})
