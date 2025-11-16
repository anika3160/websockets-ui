import { WebSocket } from 'ws'
import { Game, Id, Player } from '../../db/index.js'
import { getAllUserSockets, getUserSocket } from '../wsSessions.js'

interface ServerResponse {
  type: string
  data: string
  id: Id
}

function createServerResponse(type: string, data: object, id: Id = 0): ServerResponse {
  return {
    type,
    data: JSON.stringify(data),
    id,
  }
}

export function sendResponse(ws: WebSocket, type: string, data: object) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return
  }

  const response = createServerResponse(type, data, 0)

  console.log('Response:', response)
  ws.send(JSON.stringify(response))
}

type RoomPayload = object | ((player: Player) => object)

export function sendPersonalResponse(ws: WebSocket, type: string, data: object) {
  sendResponse(ws, type, data)
}

export function sendRoomResponse(game: Game, type: string, payload: RoomPayload) {
  for (const player of game.players) {
    const wsPlayer = getUserSocket(player.userId)
    if (!wsPlayer) continue
    const data = typeof payload === 'function' ? payload(player) : payload
    sendResponse(wsPlayer, type, data)
  }
}

export function broadcastResponse(type: string, data: object) {
  const sockets = getAllUserSockets()
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      sendResponse(socket, type, data)
    }
  }
}
