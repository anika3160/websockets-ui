import { WebSocket } from 'ws'
import { Game } from '../db/models/index.js'
import { removeUserFromRooms } from '../services/room.js'
import { findGameByPlayerUserId, removeGame } from '../services/startGame.js'
import { incrementWinnerScore } from '../services/winner.js'
import { broadcastRoomsListResponse, broadcastWinnersTable, sendFinishResponse } from './responses/index.js'
import { getUserSocket, removeUserSocket } from './wsSessions.js'

export function finalizeGame(game: Game, winnerPlayerId?: string | number, winnerUserId?: string | number) {
  if (!game) {
    return
  }
  if (winnerUserId !== undefined) {
    incrementWinnerScore(winnerUserId)
  }
  for (const player of game.players) {
    const socket = getUserSocket(player.userId)
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendFinishResponse(socket, winnerPlayerId ?? '')
    }
    removeUserFromRooms(player.userId)
  }
  removeGame(game.idGame)
  broadcastWinnersTable()
  broadcastRoomsListResponse()
}

export function handleUserDisconnectCleanup(userId: string | number) {
  removeUserSocket(userId)
  const roomsUpdated = removeUserFromRooms(userId)
  if (roomsUpdated) {
    broadcastRoomsListResponse()
  }
  const gameInfo = findGameByPlayerUserId(userId)
  if (gameInfo?.game) {
    const opponent = gameInfo.game.players.find((player) => String(player.userId) !== String(userId))
    if (opponent) {
      finalizeGame(gameInfo.game, opponent.idPlayer, opponent.userId)
    } else {
      removeGame(gameInfo.game.idGame)
      broadcastRoomsListResponse()
    }
  }
}
