import { WebSocket } from 'ws'
import { Game, Id, removeGame, removeUserFromRooms } from '../db/index.js'
import { incrementWinnerScore } from '../game/helpers/winner.js'
import { broadcastRoomsListResponse, broadcastWinnersTable, sendFinishResponse } from './responses/index.js'
import { getUserSocket } from './wsSessions.js'

export function finalizeGame(game: Game, winnerPlayerId?: Id, winnerUserId?: Id) {
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
