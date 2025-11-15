import { Coordinates, Game, Id } from '../../db/index.js'
import { normalizeId } from '../../utils/index.js'
import { isWithinBoard } from '../../utils/validation/shipValidation.js'
import { getMissCellsAroundShip, getShipCells } from './ship.js'

export function getPlayerAttackHistory(game: Game, playerId: Id): Set<string> {
  if (!game.attackedPositions) {
    game.attackedPositions = {}
  }
  const playerKey = normalizeId(playerId)
  if (!game.attackedPositions[playerKey]) {
    game.attackedPositions[playerKey] = new Set<string>()
  }
  return game.attackedPositions[playerKey]
}

export interface AttackPayload extends Coordinates {
  attackerId: Id
}

export enum AttackStatus {
  miss = 'miss',
  shot = 'shot',
  killed = 'killed',
}

export interface AttackResult {
  position: Coordinates
  currentPlayer: Id
  nextPlayerId?: Id
  status: AttackStatus[keyof AttackStatus]
  missCells?: Coordinates[]
  isFinished: boolean
  winnerPlayerId?: Id
  winnerUserId?: Id
}

export function resolveAttack(game: Game, { x, y, attackerId }: AttackPayload): AttackResult {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error('Invalid Coordinates')
  }
  if (!isWithinBoard(x, y)) {
    throw new Error('Attack out of bounds')
  }

  if (game.currentPlayer && normalizeId(game.currentPlayer) !== normalizeId(attackerId)) {
    throw new Error('Not your turn')
  }

  const playerShots = getPlayerAttackHistory(game, attackerId)
  const shotKey = `${x}_${y}`

  if (playerShots.has(shotKey)) {
    throw new Error('Cell already attacked')
  }
  playerShots.add(shotKey)

  const attacker = game.players.find((p) => normalizeId(p.idPlayer) === normalizeId(attackerId))
  const defender = game.players.find((p) => normalizeId(p.idPlayer) !== normalizeId(attackerId))

  if (!attacker || !defender) {
    throw new Error('Players not found')
  }

  let status: AttackStatus = AttackStatus.miss
  let killedShipCells: Coordinates[] | undefined

  for (const ship of defender.ships) {
    const cells = getShipCells(ship)

    const isHit = cells.some((cell) => cell.x === x && cell.y === y)
    if (!isHit) continue

    if (!ship.hits) ship.hits = []
    const hits = ship.hits

    hits.push({ x, y })

    const isKilled = cells.every((cell) => hits.some((hit) => hit.x === cell.x && hit.y === cell.y))

    if (isKilled) {
      status = AttackStatus.killed
      killedShipCells = cells
    } else {
      status = AttackStatus.shot
    }

    break
  }

  const defenderAllSunk = defender.ships.every((ship) => ship.hits && ship.hits.length === ship.length)

  const nextPlayerId = defenderAllSunk
    ? undefined
    : status === AttackStatus.miss
    ? defender.idPlayer
    : attacker.idPlayer

  game.currentPlayer = nextPlayerId

  if (defenderAllSunk) {
    game.isFinished = true
    game.winnerPlayerId = attacker.idPlayer
    game.winnerUserId = attacker.userId
  }

  return {
    position: { x, y },
    currentPlayer: attacker.idPlayer,
    nextPlayerId,
    status,
    missCells: killedShipCells ? getMissCellsAroundShip(killedShipCells) : undefined,
    isFinished: defenderAllSunk,
    winnerPlayerId: defenderAllSunk ? attacker.idPlayer : undefined,
    winnerUserId: defenderAllSunk ? attacker.userId : undefined,
  }
}
