import { WebSocket, WebSocketServer } from 'ws'
import { User } from '../db/models/index.js'
import { IncomingMessage, parseIncomingMessage } from '../utils/index.js'
import { routeEvent } from './eventRouter.js'
import { sendErrorResponse } from './responses/error.js'
import { removeUserSocket } from './wsSessions.js'

export function startWebSocketServer(port: number) {
  const server = new WebSocketServer({ port })

  server.on('connection', (ws: WebSocket) => {
    let currentUser: User | null = null

    ws.on('message', (rawData: unknown) => {
      try {
        const data = parseIncomingMessage(rawData) as IncomingMessage
        console.log('Message from client:', data)
        const nextUser = routeEvent({ ws, message: data, currentUser })
        if (nextUser) {
          currentUser = nextUser
        }
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
