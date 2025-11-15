import { Id } from '../../db/models/index.js'
import { isNumber } from '../index.js'

interface PlayerRequestData {
  gameId: Id
  indexPlayer: Id
}

interface AttackRequestData extends PlayerRequestData {
  x: number
  y: number
}

type AttackShape = PlayerRequestData & { x?: unknown; y?: unknown }

function isPlayerRequestData(data: unknown): data is PlayerRequestData {
  if (!data || typeof data !== 'object') {
    return false
  }
  const candidate = data as Record<string, unknown>
  return candidate.gameId !== undefined && candidate.indexPlayer !== undefined
}

function isAttackRequestDataShape(data: unknown): data is AttackRequestData {
  if (!isPlayerRequestData(data)) {
    return false
  }
  const candidate = data as AttackShape
  return isNumber(candidate.x) && isNumber(candidate.y)
}

export function validatePlayerRequestData(data: unknown, errorMessage: string): PlayerRequestData {
  if (!isPlayerRequestData(data)) {
    throw new Error(errorMessage)
  }

  const { gameId, indexPlayer } = data
  return { gameId, indexPlayer }
}

export function validateAttackRequestData(data: unknown): AttackRequestData {
  if (!isAttackRequestDataShape(data)) {
    throw new Error('Invalid data for attack')
  }

  const { gameId, indexPlayer, x, y } = data
  return { gameId, indexPlayer, x, y }
}
