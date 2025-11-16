import { WebSocket } from 'ws'
import { getRoomsList } from '../../db/index.js'
import { manageGameEvents } from '../../utils/constants.js'
import { broadcastResponse, sendPersonalResponse } from './utils.js'

function buildRoomsPayload(isOnlyOneUserInRoom: boolean) {
  const rooms = getRoomsList(isOnlyOneUserInRoom)
  const roomsList = rooms.map((room) => {
    const usersList = room.users.map((user) => {
      return {
        name: user.name,
        index: user.id,
      }
    })
    return {
      roomId: room.id,
      roomUsers: usersList,
    }
  })
  return roomsList
}

export function sendRoomsListResponse(ws: WebSocket, isOnlyOneUserInRoom: boolean = false) {
  const roomsList = buildRoomsPayload(isOnlyOneUserInRoom)
  sendPersonalResponse(ws, manageGameEvents.getRoomsList, roomsList)
}

export function broadcastRoomsListResponse(isOnlyOneUserInRoom: boolean = false) {
  const roomsList = buildRoomsPayload(isOnlyOneUserInRoom)
  broadcastResponse(manageGameEvents.getRoomsList, roomsList)
}
