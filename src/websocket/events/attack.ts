import { WebSocket } from 'ws'
import { Game, User } from '../../db/index.js'
import type { AttackResult } from '../../game/actions/startAttack.js'
import { startAttack } from '../../game/actions/startAttack.js'
import { gameCommands } from '../../utils/constants.js'
import { validateAttackRequestData } from '../../utils/validation/gameRequestValidation.js'
import { finalizeGame } from '../gameLifecycle.js'
import { sendErrorResponse, sendResponse, sendTurnInfo } from '../responses/index.js'
import { getUserSocket } from '../wsSessions.js'

export function attackEvent(ws: WebSocket, data: any) {
  try {
    const jsonData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data
    let attackData
    try {
      attackData = validateAttackRequestData(jsonData)
    } catch (validationError: any) {
      sendErrorResponse(ws, validationError?.message ?? 'Invalid data for attack')
      return
    }
    const { gameId, x, y, indexPlayer } = attackData
    const { game, attackResult } = startAttack({
      gameId,
      attackerId: indexPlayer,
      x,
      y,
    })
    dispatchAttackResult(game, attackResult)
  } catch (err: any) {
    console.error('Attack error:', err)
    sendErrorResponse(ws, err?.message || 'Error processing attack')
  }
}

export function dispatchAttackResult(game: Game, payload: AttackResult) {
  const responsePayload = {
    position: payload.position,
    currentPlayer: payload.currentPlayer,
    status: payload.status,
    gameId: game.idGame,
  }
  for (const player of game.players) {
    const playerSocket = getUserSocket(player.userId)
    if (playerSocket) {
      sendResponse(playerSocket, gameCommands.attack, responsePayload)
      if (payload.status === 'killed' && Array.isArray(payload.missCells)) {
        for (const missCell of payload.missCells) {
          sendResponse(playerSocket, gameCommands.attack, {
            position: missCell,
            currentPlayer: payload.currentPlayer,
            status: 'miss',
            gameId: game.idGame,
          })
        }
      }
      if (!payload.isFinished && payload.nextPlayerId) {
        sendTurnInfo(playerSocket, payload.nextPlayerId)
      }
    }
  }
  if (payload.isFinished && payload.winnerPlayerId && payload.winnerUserId) {
    finalizeGame(game, payload.winnerPlayerId, payload.winnerUserId)
  }
}
