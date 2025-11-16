import { WebSocket } from 'ws'
import { User } from '../db/index.js'
import { IncomingMessage } from '../utils/index.js'
import { gameCommands, manageGameEvents } from '../utils/constants.js'
import { sendErrorResponse } from './responses/error.js'
import { handleAttack, handleAddShips, handleRandomAttack, handleSinglePlay } from './services/gameService.js'
import { addUserToRoom, createRoomForUser, sendRoomsList } from './services/roomService.js'
import { registerUser } from './services/userService.js'

type HandlerContext = {
  ws: WebSocket
  message: IncomingMessage
  currentUser: User | null
}

type HandlerResult = User | null | void

export function routeEvent(ctx: HandlerContext): HandlerResult {
  const { message, ws, currentUser } = ctx
  const incomingType = message?.type
  if (!incomingType) {
    sendErrorResponse(ws, 'Invalid message format')
    return currentUser
  }

  if (incomingType !== manageGameEvents.registration && !currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return null
  }

  switch (incomingType) {
    case manageGameEvents.registration: {
      const user = registerUser(ws, message)
      if (user) {
        sendRoomsList(ws)
      }
      return user
    }

    case manageGameEvents.createRoom:
      if (!currentUser) return null
      createRoomForUser(currentUser)
      return currentUser

    case manageGameEvents.getRoomsList:
      sendRoomsList(ws)
      return currentUser

    case manageGameEvents.addUserToRoom:
      if (!currentUser) return null
      addUserToRoom(ws, message, currentUser)
      return currentUser

    case manageGameEvents.addShips:
      handleAddShips(ws, message)
      return currentUser

    case manageGameEvents.singlePlay:
      if (!currentUser) return null
      handleSinglePlay(ws, currentUser)
      return currentUser

    case gameCommands.attack:
      handleAttack(ws, message)
      return currentUser

    case gameCommands.randomAttack:
      handleRandomAttack(ws, message)
      return currentUser

    default:
      sendErrorResponse(ws, 'Unknown event type')
      return currentUser
  }
}
