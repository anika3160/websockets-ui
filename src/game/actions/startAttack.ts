import { Game, getGameById, Id } from '../../db/index.js'
import { AttackResult, AttackStatus, resolveAttack } from '../helpers/attack.js'

type LaunchAttackInput = {
  gameId: Id
  attackerId: Id
  x: number
  y: number
}

type LaunchAttackResult = {
  game: Game
  attackResult: AttackResult
}

export { AttackStatus }
export type { AttackResult }

export function startAttack({ gameId, attackerId, x, y }: LaunchAttackInput): LaunchAttackResult {
  const game = getGameById(gameId)

  if (!game) {
    throw new Error('Game not found')
  }

  const attackResult = resolveAttack(game, { attackerId, x, y })

  return {
    game,
    attackResult,
  }
}
