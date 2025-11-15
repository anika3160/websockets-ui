import { Game, Id, Player } from '../../db/index.js'
import { idsEqual } from '../../utils/index.js'

const findPlayerInGame = (game: Game, playerId: Id): Player | undefined =>
  game.players.find((p) => idsEqual(p.idPlayer, playerId))

export function assignShipsToPlayer(game: Game, playerId: Id, ships: Player['ships']): Player {
  const player = findPlayerInGame(game, playerId)
  if (!player) {
    throw new Error('Player not found')
  }

  player.ships = ships
  return player
}

export function getRandomStartingPlayer(game: Game): Player {
  const index = Math.floor(Math.random() * game.players.length)
  const player = game.players[index]
  game.currentPlayer = player.idPlayer
  return player
}
