import { handleCreateRoom } from '../handlers/createRoom.js'
import { sendErrorResponse } from '../responses/index.js'
import { User } from '../../db/models/index.js'
import { WebSocket } from 'ws'

export function handleCreateRoomEvent(ws: WebSocket, currentUser: User | null) {
  if (!currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return
  }
  handleCreateRoom(ws, currentUser)
}

