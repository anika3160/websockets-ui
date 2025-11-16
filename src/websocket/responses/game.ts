import { WebSocket } from 'ws'
import { Game, Id } from '../../db/index.js'
import { gameCommands, manageGameEvents } from '../../utils/constants.js'
import { sendPersonalResponse, sendRoomResponse } from './utils.js'

export function sendCreateGameResponse(ws: WebSocket, idGame: Id, idPlayer: Id) {
  sendPersonalResponse(ws, manageGameEvents.createGame, {
    idGame,
    idPlayer,
  })
}

export function sendFinishResponse(ws: WebSocket, winnerPlayerId: Id) {
  sendPersonalResponse(ws, manageGameEvents.finishGame, {
    winPlayer: winnerPlayerId,
  })
}

export function sendStartGameResponse(game: Game) {
  sendRoomResponse(game, manageGameEvents.startGame, (player) => ({
    ships: player.ships,
    currentPlayerIndex: player.idPlayer,
  }))
}

export function broadcastTurnInfo(game: Game, currentPlayer: Id) {
  sendRoomResponse(game, gameCommands.turn, {
    currentPlayer,
  })
}
