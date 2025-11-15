import { WebSocket } from 'ws'
import { User } from '../../db/index.js'
import { sendRegistrationResponse } from '../responses/index.js'
import { setUserSocket } from '../wsSessions.js'

export function registerUser(ws: WebSocket, data: any): User | null {
  console.log('Registration event received:', data)
  const currentUser = sendRegistrationResponse(ws, data)
  if (!currentUser) {
    return null
  }
  setUserSocket(currentUser.id, ws)
  return currentUser
}
