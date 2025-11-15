import { WebSocket } from 'ws'
import { User } from '../../db/index.js'
import { joinRoom } from '../../game/actions/joinRoom.js'
import { parseJSONData } from '../../utils/index.js'
import { sendCreateGameResponse, sendErrorResponse } from '../responses/index.js'
import { getUserSocket } from '../wsSessions.js'

export function addUserToRoomEvent(ws: WebSocket, data: any, currentUser: User) {
  let indexRoom
  try {
    indexRoom = typeof data.data === 'string' ? parseJSONData(data.data).indexRoom : data.data.indexRoom
  } catch {
    sendErrorResponse(ws, 'Invalid data for addUserToRoom')
    return
  }
  try {
    const { game } = joinRoom({
      roomId: indexRoom,
      user: {
        id: currentUser.id,
        name: currentUser.name,
      },
    })

    if (!game) {
      return
    }

    for (const player of game.players) {
      const wsPlayer = getUserSocket(player.userId)
      if (wsPlayer) {
        sendCreateGameResponse(wsPlayer, game.idGame, player.idPlayer)
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to join room'
    sendErrorResponse(ws, message)
    return
  }
}
