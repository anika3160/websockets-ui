import { WebSocket } from 'ws'
import { getRoomsList } from '../../db/index.js'
import { manageGameEvents } from '../../utils/constants.js'
import { getAllUserSockets } from '../wsSessions.js'
import { sendResponse } from './utils.js'

/*
{
    type: "update_room",
    data:
        [
            {
                roomId: <number | string>,
                roomUsers:
                    [
                        {
                            name: <string>,
                            index: <number | string>,
                        }
                    ],
            },
        ],
    id: 0,
}
*/
/*
 interface Room {
  id: number | string
  users: {
    name: string
    id: number | string
  }[]
} */

export function sendRoomsListResponse(ws: WebSocket, isOnlyOneUserInRoom: boolean = false) {
  const rooms = getRoomsList(isOnlyOneUserInRoom)
  const roomsList = rooms.map((room) => {
    const usersList = room.users.map((user) => {
      return {
        name: user.name,
        index: user.id,
      }
    })
    return {
      roomId: room.id,
      roomUsers: usersList,
    }
  })
  sendResponse(ws, manageGameEvents.getRoomsList, roomsList)
}

export function broadcastRoomsListResponse(isOnlyOneUserInRoom: boolean = false) {
  const sockets = getAllUserSockets()
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      sendRoomsListResponse(socket, isOnlyOneUserInRoom)
    }
  }
}
