import { Game, Id, Player } from '../../db/models/index.js'
import { idsEqual } from '../../utils/index.js'
import { findGameById } from '../startGame.js'

const findPlayerInGame = (game: Game, playerId: Id): Player | undefined =>
  game.players.find((p) => idsEqual(p.idPlayer, playerId))

export function addShipsToPlayer(gameId: Id, indexPlayer: Id, ships: Player['ships']): void {
  const game = findGameById(gameId)
  if (!game) {
    throw new Error('Game not found')
  }

  const player = findPlayerInGame(game, indexPlayer)
  if (!player) {
    throw new Error('Player not found')
  }

  player.ships = ships
}
