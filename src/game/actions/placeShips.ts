import { Game, getGameById, Id, Player } from '../../db/index.js'
import { assignShipsToPlayer, getRandomStartingPlayer } from '../helpers/player.js'

type PlaceShipsInput = {
  gameId: Id
  playerId: Id
  ships: Player['ships']
}

type PlaceShipsResult = {
  game: Game
  allPlayersReady: boolean
  startingPlayerId?: Id
}

export function placeShips({ gameId, playerId, ships }: PlaceShipsInput): PlaceShipsResult {
  const game = getGameById(gameId)

  if (!game) {
    throw new Error('Game not found')
  }

  assignShipsToPlayer(game, playerId, ships)

  const allPlayersReady = game.players.every((p) => p.ships && p.ships.length > 0)
  let startingPlayerId: Id | undefined

  if (allPlayersReady && !game.currentPlayer) {
    startingPlayerId = getRandomStartingPlayer(game).idPlayer
  }

  return {
    game,
    allPlayersReady,
    startingPlayerId,
  }
}
