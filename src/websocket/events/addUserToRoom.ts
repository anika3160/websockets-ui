import { WebSocket } from 'ws'
import { User } from '../../db/models/index.js'
import { createGame } from '../../services/startGame.js'
import { parseJSONData } from '../../utils/index.js'
import { handleAddUserToRoom } from '../handlers/roomMembership.js'
import { sendCreateGameResponse, sendErrorResponse } from '../responses/index.js'
import { getUserSocket } from '../wsSessions.js'

export function handleAddUserToRoomEvent(ws: WebSocket, dataObject: any, currentUser: User | null) {
  if (!currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return
  }
  let indexRoom
  try {
    indexRoom =
      typeof dataObject.data === 'string' ? parseJSONData(dataObject.data).indexRoom : dataObject.data.indexRoom
  } catch {
    sendErrorResponse(ws, 'Invalid data for addUserToRoom')
    return
  }
  const currentRoom = handleAddUserToRoom(ws, indexRoom, currentUser)
  if (!currentRoom) {
    sendErrorResponse(ws, 'Room not found')
    return
  }
  // if 2 users in room, create game
  const game = createGame(currentRoom.id)
  if (!game) {
    sendErrorResponse(ws, 'Game not created')
    return
  }
  // send gameId to both players
  for (const player of game.players) {
    const wsPlayer = getUserSocket(player.userId)
    if (wsPlayer) {
      sendCreateGameResponse(wsPlayer, game.idGame, player.idPlayer)
    }
  }
}
