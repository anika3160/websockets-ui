import { Room } from '../models/index.js'
import { rooms } from '../storage/rooms.js'

export function createRoom() {
  const idx = rooms.length + 1
  const room: Room = {
    id: idx,
    users: [],
  }
  rooms.push(room)
  return room
}

export function getRoomIdInDBbyIndex(index: number | string) {
  return rooms.findIndex((room) => room.id === index)
}
export function isRoomExists(id: number | string) {
  return rooms.some((room) => room.id === id)
}
export function isUserInRoom(roomId: number | string, userId: number | string) {
  const roomIndex = getRoomIdInDBbyIndex(roomId)
  if (roomIndex === -1) {
    return false
  }
  return rooms[roomIndex].users.some((user) => user.id === userId)
}

export function addUserToRoom(roomId: number | string, user: { name: string, id: number | string }): void {
  console.log('roomId:', roomId)
  console.log('user:', user)
  const roomIndex = getRoomIdInDBbyIndex(roomId)
  if (roomIndex === -1) {
    throw Error('Room not found')
  }
  const isUserInRoom = !!rooms[roomIndex].users.find((u) => u.id === user.id)
  console.log('isUserInRoom:', isUserInRoom)
  if (isUserInRoom) {
    throw Error('User already in room')
  }
  console.log('NO error')
  const currentRoomUsersList = rooms[roomIndex].users
  if (currentRoomUsersList.length < 2) {
    rooms[roomIndex].users.push({
      name: user.name, id: user.id,
    })
  return
  }
  throw Error('Room is full')
}

export const getRoomsList = (isOnlyOneUserInRoom: boolean = false) => {
  if (isOnlyOneUserInRoom) {
    return rooms.filter((room) => room.users?.length === 1)
  }
  return rooms
}

export function getUsersInRoomByRoomId (id: number | string) {
  const roomIndex = getRoomIdInDBbyIndex(id)
  if (roomIndex === -1) {
    return
  }
  return rooms[roomIndex].users
}

export function getRoomById(id  : number | string) {
  const roomIndex = getRoomIdInDBbyIndex(id)
  if (roomIndex === -1) {
    return
  }
  return rooms[roomIndex]
}