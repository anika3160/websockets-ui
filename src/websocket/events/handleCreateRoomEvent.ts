import { WebSocket } from 'ws'
import { User } from '../../db/models/index.js'
import { addUserToRoom, createRoom } from '../../services/room.js'
import { sendErrorResponse } from '../responses/index.js'
import { sendRoomsListResponse } from '../responses/room.js'

export function handleCreateRoomEvent(ws: WebSocket, currentUser: User | null) {
  if (!currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return
  }
  console.log('Create room event received by user:', currentUser)
  const currentRoom = createRoom()
  console.log('Current room:', currentRoom)
  addUserToRoom(currentRoom.id, {
    name: currentUser.name,
    id: currentUser.id,
  })
  sendRoomsListResponse(ws)
  return currentRoom
}
