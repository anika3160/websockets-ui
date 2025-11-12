import { WebSocket } from 'ws'

const userSockets: Record<string, WebSocket> = {}

export function setUserSocket(userId: string | number, ws: WebSocket) {
  userSockets[userId] = ws
}

export function getUserSocket(userId: string | number): WebSocket | undefined {
  return userSockets[userId]
}

export function removeUserSocket(userId: string | number) {
  delete userSockets[userId]
}
