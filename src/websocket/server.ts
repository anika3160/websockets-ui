import { WebSocket, WebSocketServer } from 'ws'
import { User } from '../db/models/index.js'
import { gameCommands, manageGameEvents } from '../utils/constants.js'
import { parseJSONData } from '../utils/index.js'
import { attackEvent } from './events/attack.js'
import { addShipsEvent, addUserToRoomEvent, createRoomAndAssignUser } from './events/index.js'
import { randomAttackEvent } from './events/randomAttack.js'
import { registerUser } from './events/userRegistration.js'
import { sendErrorResponse } from './responses/error.js'
import { sendRoomsListResponse } from './responses/index.js'
import { removeUserSocket } from './wsSessions.js'

type IncomingMessage = {
  type?: string
  [key: string]: unknown
}

function routeMessage(ws: WebSocket, data: IncomingMessage, currentUser: User | null): User | null {
  if (!data?.type) {
    sendErrorResponse(ws, 'Invalid message format')
    return currentUser
  }

  if (data.type === manageGameEvents.registration) {
    const newUser = registerUser(ws, data)
    sendRoomsListResponse(ws)
    return newUser
  }

  if (!currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return null
  }

  switch (data.type) {
    case manageGameEvents.createRoom:
      createRoomAndAssignUser(currentUser)
      sendRoomsListResponse(ws)
      return currentUser

    case manageGameEvents.getRoomsList:
      sendRoomsListResponse(ws)
      return currentUser

    case manageGameEvents.addUserToRoom:
      addUserToRoomEvent(ws, data, currentUser)
      return currentUser

    case manageGameEvents.addShips:
      addShipsEvent(ws, data)
      return currentUser

    case gameCommands.attack:
      attackEvent(ws, data)
      return currentUser

    case gameCommands.randomAttack:
      randomAttackEvent(ws, data)
      return currentUser

    default:
      sendErrorResponse(ws, 'Unknown event type')
      return currentUser
  }
}

export function startWebSocketServer(port: number) {
  const server = new WebSocketServer({ port })

  server.on('connection', (ws: WebSocket) => {
    let currentUser: User | null = null

    ws.on('message', (rawData: unknown) => {
      try {
        const text = typeof rawData === 'string' ? rawData : rawData?.toString?.()
        const data = parseJSONData(text ?? '') as IncomingMessage

        console.log('Message from client:', data)

        currentUser = routeMessage(ws, data, currentUser)
      } catch (err) {
        console.error('WebSocket message error:', err)
        const message = err instanceof Error ? err.message : 'Internal server error'
        sendErrorResponse(ws, message)
      }
    })

    ws.on('close', () => {
      console.log('Connection closed.')
      if (currentUser) {
        removeUserSocket(currentUser.id)
      }
      currentUser = null
    })
  })
}
