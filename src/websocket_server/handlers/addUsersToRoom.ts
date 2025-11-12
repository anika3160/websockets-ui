import { WebSocket } from 'ws'
import { User } from '../../db/models/index.js'
import { addUserToRoom, getRoomById, isRoomExists, isUserInRoom } from '../../db/services/roomService.js'

export function handleAddUserToRoom(ws: WebSocket, indexRoom: string | number, currentUser: User | null) {
  console.log('Add user to room event received:', indexRoom)
  // check if room exists
  if (!isRoomExists(indexRoom)) {
    throw Error('Room not found')
  }
  // check if user already in room
  if (!currentUser) {
    throw Error('User not found')
  }
  const roomIndex = isUserInRoom(indexRoom, currentUser?.id)
  if (roomIndex) {
    throw Error('User already in room')
  }

  if (currentUser) {
    try {
      addUserToRoom(indexRoom, {
        name: currentUser.name,
        id: currentUser.id,
      })
      console.log('User added to room:', indexRoom)
    } catch (error) {
      console.error('Error adding user to room:', error)
    }
  }
  const currentRoom = getRoomById(indexRoom)
  return currentRoom
}
