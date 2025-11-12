import { WebSocket } from 'ws'
import { Room, User } from '../../db/models/index.js'
import { addUserToRoom, createRoom } from '../../db/services/roomService.js'
import { sendRoomsListResponse } from '../responses/room.js'

export function handleCreateRoom(ws: WebSocket, currentUser: User | null): Room | undefined {
  console.log('Create room event received by user:', currentUser)
  const currentRoom = createRoom()
  console.log('Current room:', currentRoom)
  if (currentUser && currentRoom) {
    addUserToRoom(currentRoom.id, {
      name: currentUser.name,
      id: currentUser.id,
    })
  }
  sendRoomsListResponse(ws)
  return currentRoom
}
