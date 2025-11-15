import { Id, Player } from '../models/index.js'

let lastPlayerId = 1000

const getNextPlayerId = (): number => ++lastPlayerId

export const createPlayer = (userId: Id, idGame: Id): Player => ({
  userId,
  idPlayer: getNextPlayerId(),
  idGame,
  ships: [],
})
