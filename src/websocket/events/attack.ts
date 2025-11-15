import { WebSocket } from 'ws'
import { Game, User } from '../../db/models/index.js'
import { handleAttack } from '../../services/game.js'
import { getGameById } from '../../services/startGame.js'
import { gameCommands } from '../../utils/constants.js'
import { validateAttackRequestData } from '../../utils/validation/gameRequestValidation.js'
import { finalizeGame } from '../gameLifecycle.js'
import { sendErrorResponse, sendResponse, sendTurnInfo } from '../responses/index.js'
import { getUserSocket } from '../wsSessions.js'

export function handleAttackEvent(ws: WebSocket, dataObject: any, currentUser: User | null) {
  if (!currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return
  }
  try {
    const jsonData = typeof dataObject.data === 'string' ? JSON.parse(dataObject.data) : dataObject.data
    let attackData
    try {
      attackData = validateAttackRequestData(jsonData)
    } catch (validationError: any) {
      sendErrorResponse(ws, validationError?.message ?? 'Invalid data for attack')
      return
    }
    const { gameId, x, y, indexPlayer } = attackData
    const game = getGameById(gameId)
    if (!game) {
      sendErrorResponse(ws, 'Game not found')
      return
    }
    executeAttack(ws, {
      game,
      gameId,
      attackerId: indexPlayer,
      x,
      y,
    })
  } catch (err: any) {
    console.error('Attack error:', err)
    sendErrorResponse(ws, err?.message || 'Error processing attack')
  }
}

interface ExecuteAttackPayload {
  game: Game
  gameId: string | number
  attackerId: string | number
  x: number
  y: number
}

export function executeAttack(ws: WebSocket, payload: ExecuteAttackPayload) {
  const { game, gameId, attackerId, x, y } = payload
  if (!game) {
    sendErrorResponse(ws, 'Game not found')
    return
  }
  if (game.currentPlayer && String(game.currentPlayer) !== String(attackerId)) {
    sendErrorResponse(ws, 'Not your turn')
    return
  }
  try {
    const result = handleAttack({
      gameId,
      indexPlayer: attackerId,
      x,
      y,
    })
    const isFinished = Boolean(result.isFinished)
    const responsePayload = {
      position: result.position,
      currentPlayer: result.currentPlayer,
      status: result.status,
      gameId,
    }
    for (const player of game.players) {
      const playerSocket = getUserSocket(player.userId)
      if (playerSocket) {
        sendResponse(playerSocket, gameCommands.attack, responsePayload)
        if (result.status === 'killed' && Array.isArray(result.missCells)) {
          for (const missCell of result.missCells) {
            sendResponse(playerSocket, gameCommands.attack, {
              position: missCell,
              currentPlayer: result.currentPlayer,
              status: 'miss',
              gameId,
            })
          }
        }
        if (!isFinished && result.nextPlayerId) {
          sendTurnInfo(playerSocket, result.nextPlayerId)
        }
      }
    }
    if (isFinished && result.winnerPlayerId && result.winnerUserId) {
      finalizeGame(game, result.winnerPlayerId, result.winnerUserId)
    }
  } catch (err: any) {
    console.error('executeAttack error:', err)
    sendErrorResponse(ws, err?.message || 'Error processing attack')
  }
}
