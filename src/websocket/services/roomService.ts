import { WebSocket } from 'ws'
import { addUserToRoom as addUserToRoomInDB, createNewEmptyRoomAndSaveInDB, User } from '../../db/index.js'
import { joinRoom } from '../../game/actions/joinRoom.js'
import { parseJSONData } from '../../utils/index.js'
import { broadcastRoomsListResponse, sendCreateGameResponse, sendErrorResponse, sendRoomsListResponse } from '../responses/index.js'
import { getUserSocket } from '../wsSessions.js'

export function createRoomForUser(currentUser: User) {
  console.log('Create room event received by user:', currentUser)
  const room = createNewEmptyRoomAndSaveInDB()
  addUserToRoomInDB(room.id, {
    name: currentUser.name,
    id: currentUser.id,
  })
  broadcastRoomsListResponse()
  return room
}

export function addUserToRoom(ws: WebSocket, message: any, currentUser: User) {
  let indexRoom
  try {
    indexRoom = typeof message.data === 'string' ? parseJSONData(message.data).indexRoom : message.data.indexRoom
  } catch {
    sendErrorResponse(ws, 'Invalid data for addUserToRoom')
    return
  }
  try {
    const { game } = joinRoom({
      roomId: indexRoom,
      user: {
        id: currentUser.id,
        name: currentUser.name,
      },
    })

    if (!game) {
      return
    }

    for (const player of game.players) {
      const wsPlayer = getUserSocket(player.userId)
      if (wsPlayer) {
        sendCreateGameResponse(wsPlayer, game.idGame, player.idPlayer)
      }
    }
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Failed to join room'
    sendErrorResponse(ws, messageText)
  }
}

export function sendRoomsList(ws: WebSocket, isOnlyOneUserInRoom: boolean = false) {
  sendRoomsListResponse(ws, isOnlyOneUserInRoom)
}
