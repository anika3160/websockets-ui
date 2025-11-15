import { WebSocket } from 'ws'
import { getGameById } from '../../db/index.js'
import { startAttack } from '../../game/actions/startAttack.js'
import { getPlayerAttackHistory } from '../../game/helpers/attack.js'
import { boardArea } from '../../game/helpers/ship.js'
import { validatePlayerRequestData } from '../../utils/validation/gameRequestValidation.js'
import { sendErrorResponse } from '../responses/index.js'
import { dispatchAttackResult } from './attack.js'

type GameCoordinate = { x: number; y: number }

function parseEventData(data: any): unknown {
  return typeof data?.data === 'string' ? JSON.parse(data.data) : data?.data
}

function collectAvailableCells(attackedPositions: Set<string>): GameCoordinate[] {
  const cells: GameCoordinate[] = []
  const { min, max } = boardArea

  for (let x = min; x <= max; x += 1) {
    for (let y = min; y <= max; y += 1) {
      const key = `${x}_${y}`
      if (!attackedPositions.has(key)) {
        cells.push({ x, y })
      }
    }
  }

  return cells
}

function getRandomAvailableCell(attackedPositions: Set<string>): GameCoordinate | null {
  const cells = collectAvailableCells(attackedPositions)
  if (cells.length === 0) return null

  const index = Math.floor(Math.random() * cells.length)
  return cells[index]
}

export function randomAttackEvent(ws: WebSocket, data: any) {
  try {
    const jsonData = parseEventData(data)
    const { gameId, indexPlayer } = validatePlayerRequestData(jsonData, 'Invalid data for random attack')

    const game = getGameById(gameId)
    if (!game) {
      sendErrorResponse(ws, 'Game not found')
      return
    }

    if (game.currentPlayer && String(game.currentPlayer) !== String(indexPlayer)) {
      sendErrorResponse(ws, 'Not your turn')
      return
    }

    const playerAttacks = getPlayerAttackHistory(game, indexPlayer)
    const randomCell = getRandomAvailableCell(playerAttacks)

    if (!randomCell) {
      sendErrorResponse(ws, 'No available cells for attack')
      return
    }

    const { x, y } = randomCell

    const { game: updatedGame, attackResult } = startAttack({
      gameId,
      attackerId: indexPlayer,
      x,
      y,
    })
    dispatchAttackResult(updatedGame, attackResult)
  } catch (err: any) {
    console.error('Random attack error:', err)
    sendErrorResponse(ws, err?.message || 'Failed to perform random attack')
  }
}
