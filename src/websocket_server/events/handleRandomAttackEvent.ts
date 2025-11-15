import { WebSocket } from 'ws'
import { User } from '../../db/models/index.js'
import { boardArea } from '../../services/attack/shipUtils.js'
import { getPlayerAttackHistory } from '../../services/game.js'
import { getGameById } from '../../services/startGame.js'
import { validatePlayerRequestData } from '../../utils/validation/gameRequestValidation.js'
import { sendErrorResponse } from '../responses/index.js'
import { executeAttack } from './handleAttackEvent.js'

type GameCoordinate = { x: number; y: number }

function parseEventData(dataObject: any): unknown {
  return typeof dataObject?.data === 'string' ? JSON.parse(dataObject.data) : dataObject?.data
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

export function handleRandomAttackEvent(ws: WebSocket, dataObject: any, currentUser: User | null) {
  if (!currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return
  }

  try {
    const jsonData = parseEventData(dataObject)
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

    executeAttack(ws, {
      game,
      gameId,
      attackerId: indexPlayer,
      x,
      y,
    })
  } catch (err: any) {
    console.error('Random attack error:', err)
    sendErrorResponse(ws, err?.message || 'Failed to perform random attack')
  }
}
