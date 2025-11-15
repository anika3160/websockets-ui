import { WebSocket } from 'ws'
import { User } from '../../db/models/index.js'
import { sendRegistrationResponse, sendRoomsListResponse } from '../responses/index.js'
import { setUserSocket } from '../wsSessions.js'

export function registerUser(ws: WebSocket, dataObject: any): User | null {
  console.log('Registration event received:', dataObject)
  const currentUser = sendRegistrationResponse(ws, dataObject)
  if (!currentUser) {
    return null
  }
  setUserSocket(currentUser.id, ws)
  sendRoomsListResponse(ws)
  return currentUser
}
