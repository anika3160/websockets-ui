import { WebSocket } from 'ws'
import { User, getGameById } from '../../db/index.js'
import { placeShips } from '../../game/actions/placeShips.js'
import { startAttack } from '../../game/actions/startAttack.js'
import { getPlayerAttackHistory } from '../../game/helpers/attack.js'
import { getRandomAvailableCell } from '../../game/helpers/board.js'
import { validateAttackRequestData, validatePlayerRequestData } from '../../utils/validation/gameRequestValidation.js'
import { broadcastTurnInfo, sendCreateGameResponse, sendErrorResponse, sendStartGameResponse } from '../responses/index.js'
import { dispatchAttackResult } from '../gameDispatch.js'
import { createSinglePlayerGame, maybeHandleBotTurn } from './botService.js'

export function handleRandomAttack(ws: WebSocket, message: any) {
  try {
    const jsonData = typeof message?.data === 'string' ? JSON.parse(message.data) : message?.data
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

export function handleAttack(ws: WebSocket, message: any) {
  try {
    const jsonData = typeof message.data === 'string' ? JSON.parse(message.data) : message.data
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

export function handleAddShips(ws: WebSocket, message: any) {
  try {
    const jsonData = typeof message.data === 'string' ? JSON.parse(message.data) : message.data
    const { gameId, ships, indexPlayer } = jsonData
    const { game, allPlayersReady } = placeShips({
      gameId,
      playerId: indexPlayer,
      ships,
    })

    if (allPlayersReady) {
      sendStartGameResponse(game)
      if (game.currentPlayer !== undefined) {
        broadcastTurnInfo(game, game.currentPlayer)
      }
      maybeHandleBotTurn(game)
    }
  } catch (err) {
    console.error('Error in handleAddShips:', err)
    const messageText = err instanceof Error ? err.message : 'Error saving ships'
    sendErrorResponse(ws, messageText)
  }
}

export function handleSinglePlay(ws: WebSocket, currentUser: User) {
  try {
    const { game, userPlayer } = createSinglePlayerGame(currentUser)
    sendCreateGameResponse(ws, game.idGame, userPlayer.idPlayer)
  } catch (err) {
    const messageText = err instanceof Error ? err.message : 'Failed to start single player game'
    sendErrorResponse(ws, messageText)
  }
}
