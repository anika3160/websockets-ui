import { idsEqual } from '../../utils/index.js'
import { Id, Room } from '../models/index.js'
import { rooms } from '../storage/rooms.js'

export function createNewEmptyRoomAndSaveInDB(): Room {
  const id = rooms.length + 1
  const room: Room = {
    id,
    users: [],
  }

  rooms.push(room)
  return room
}

export function getRoomById(id: Id): Room | undefined {
  return rooms.find((room) => idsEqual(room.id, id))
}

export function isRoomExists(id: Id): boolean {
  return Boolean(getRoomById(id))
}

export function getUsersInRoomByRoomId(id: Id) {
  return getRoomById(id)?.users
}

export function isUserInRoom(roomId: Id, userId: Id): boolean {
  const room = getRoomById(roomId)
  if (!room) return false

  return room.users.some((user) => idsEqual(user.id, userId))
}

export function addUserToRoom(roomId: Id, user: { name: string; id: Id }): Room {
  const room = getRoomById(roomId)
  if (!room) {
    throw new Error('Room not found')
  }

  const userAlreadyInRoom = room.users.some((u) => idsEqual(u.id, user.id))
  if (userAlreadyInRoom) {
    throw new Error('User already in room')
  }

  if (room.users.length >= 2) {
    throw new Error('Room is full')
  }

  room.users.push({
    name: user.name,
    id: user.id,
  })

  return room
}

export function getRoomsList(isOnlyOneUserInRoom: boolean = false) {
  if (isOnlyOneUserInRoom) {
    return rooms.filter((room) => room.users?.length === 1)
  }
  return rooms
}

export function removeUserFromRooms(userId: Id): boolean {
  let updated = false

  for (let i = rooms.length - 1; i >= 0; i -= 1) {
    const room = rooms[i]
    const initialLength = room.users.length

    const filteredUsers = room.users.filter((user) => !idsEqual(user.id, userId))

    if (filteredUsers.length !== initialLength) {
      room.users = filteredUsers
      updated = true
    }

    if (room.users.length === 0) {
      rooms.splice(i, 1)
      updated = true
    }
  }

  return updated
}
