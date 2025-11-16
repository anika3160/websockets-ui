import { WebSocket } from 'ws'
import { Id } from '../db/index.js'

const userSockets: Record<string, WebSocket> = {}

export function setUserSocket(userId: Id, ws: WebSocket) {
  userSockets[userId] = ws
}

export function getUserSocket(userId: Id): WebSocket | undefined {
  return userSockets[userId]
}

export function removeUserSocket(userId: Id) {
  delete userSockets[userId]
}

export function getAllUserSockets(): WebSocket[] {
  return Object.values(userSockets)
}
