import { WebSocket, WebSocketServer } from 'ws'
import { User } from '../db/models/index.js'
import { gameCommands, manageGameEvents } from '../utils/constants.js'
import { parseJSONData } from '../utils/index.js'
import { handleAttackEvent } from './events/attack.js'
import { handleRandomAttackEvent } from './events/randomAttack.js'
import { handleAddShipsEvent, handleAddUserToRoomEvent, handleCreateRoomEvent } from './events/index.js'
import { registerUser } from './handlers/index.js'
import { sendErrorResponse } from './responses/error.js'
import { sendRoomsListResponse } from './responses/index.js'
import { removeUserSocket } from './wsSessions.js'

type IncomingMessage = {
  type?: string
  [key: string]: unknown
}

function routeMessage(ws: WebSocket, dataObject: IncomingMessage, currentUser: User | null): User | null {
  if (!dataObject?.type) {
    sendErrorResponse(ws, 'Invalid message format')
    return currentUser
  }

  switch (dataObject.type) {
    case manageGameEvents.registration:
      return registerUser(ws, dataObject)

    case manageGameEvents.createRoom:
      handleCreateRoomEvent(ws, currentUser)
      return currentUser

    case manageGameEvents.getRoomsList:
      sendRoomsListResponse(ws)
      return currentUser

    case manageGameEvents.addUserToRoom:
      handleAddUserToRoomEvent(ws, dataObject, currentUser)
      return currentUser

    case manageGameEvents.addShips:
      handleAddShipsEvent(ws, dataObject, currentUser)
      return currentUser

    case gameCommands.attack:
      handleAttackEvent(ws, dataObject, currentUser)
      return currentUser

    case gameCommands.randomAttack:
      handleRandomAttackEvent(ws, dataObject, currentUser)
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
        const dataObject = parseJSONData(text ?? '') as IncomingMessage

        console.log('Message from client:', dataObject)

        currentUser = routeMessage(ws, dataObject, currentUser)
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
