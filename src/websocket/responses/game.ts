import { WebSocket } from 'ws'
import { Id } from '../../db/index.js'
import { gameCommands, manageGameEvents } from '../../utils/constants.js'
import { sendResponse } from './utils.js'

export function sendCreateGameResponse(ws: WebSocket, idGame: Id, idPlayer: Id) {
  sendResponse(ws, manageGameEvents.createGame, {
    idGame,
    idPlayer,
  })
}
export function sendTurnInfo(ws: WebSocket, currentPlayer: Id) {
  sendResponse(ws, gameCommands.turn, {
    currentPlayer,
  })
}

export function sendFinishResponse(ws: WebSocket, winnerPlayerId: Id) {
  sendResponse(ws, manageGameEvents.finishGame, {
    winPlayer: winnerPlayerId,
  })
}
