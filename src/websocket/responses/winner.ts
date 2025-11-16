import { WebSocket } from 'ws'
import { getWinnersTable } from '../../game/helpers/winner.js'
import { manageGameEvents } from '../../utils/constants.js'
import { broadcastResponse, sendPersonalResponse } from './utils.js'

export function sendWinnersTableResponse(ws: WebSocket) {
  const winners = getWinnersTable()
  sendPersonalResponse(ws, manageGameEvents.updateWinners, winners)
}

export function broadcastWinnersTable() {
  const winners = getWinnersTable()
  broadcastResponse(manageGameEvents.updateWinners, winners)
}
