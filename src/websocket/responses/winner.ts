import { WebSocket } from 'ws'
import { getWinnersTable } from '../../services/winner.js'
import { manageGameEvents } from '../../utils/constants.js'
import { getAllUserSockets } from '../wsSessions.js'
import { sendResponse } from './utils.js'

export function sendWinnersTableResponse(ws: WebSocket) {
  const winners = getWinnersTable()
  sendResponse(ws, manageGameEvents.updateWinners, winners)
}

export function broadcastWinnersTable() {
  const sockets = getAllUserSockets()
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      sendWinnersTableResponse(socket)
    }
  }
}
