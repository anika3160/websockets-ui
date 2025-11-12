import { WebSocket } from 'ws'
import { createRoom, getRoomsList } from '../../db/services/index.js'
import { manageGameEvents } from '../../utils/constants.js'
import { sendResponse } from './utils.js'

export function handleCreateRoom(ws: WebSocket) {
  const room = createRoom()
  if (!room.id) {
    return
  }
  sendResponse(ws, manageGameEvents.createRoom, {
    roomIndex: room.id,
    error: false,
    errorText: '',
  })
  return room.id
}

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
