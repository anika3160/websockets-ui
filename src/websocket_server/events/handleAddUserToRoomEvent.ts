
import { WebSocket } from 'ws'
import { sendErrorResponse } from '../responses/index.js'
import { getUserSocket } from '../wsSessions.js'
import { User } from '../../db/models/index.js'
import { parseJSONData } from '../../utils/utils.js'
import { handleAddUserToRoom } from '../handlers/addUsersToRoom.js'
import { createGame } from '../../db/services/gameService.js'
import { sendCreateGameResponse } from '../responses/index.js'

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
    sendErrorResponse(ws, 'Room or user not found')
    return
  }
  // if 2 users in room, create game
  const game = createGame(currentRoom.id)
  if (!game) {
    sendErrorResponse(ws, 'Game not created')
    return
  }
  // send gameId to both players
  for (const player of currentRoom.users) {
    const wsPlayer = getUserSocket(player.id)
    if (wsPlayer) {
      sendCreateGameResponse(wsPlayer, game.idGame, player.id)
    }
  }
}
