import { WebSocket } from 'ws'
import { User } from '../../db/index.js'
import { sendRegistrationResponse } from '../responses/index.js'
import { setUserSocket } from '../wsSessions.js'

export function registerUser(ws: WebSocket, message: any): User | null {
  console.log('Registration event received:', message)
  const currentUser = sendRegistrationResponse(ws, message)
  if (!currentUser) {
    return null
  }
  setUserSocket(currentUser.id, ws)
  return currentUser
}
