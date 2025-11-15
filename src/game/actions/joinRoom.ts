import { addUserToRoom, createGame, Game, Id, isRoomExists, isUserInRoom, Room, User } from '../../db/index.js'

type JoinRoomInput = {
  roomId: Id
  user: Pick<User, 'id' | 'name'>
}

type JoinRoomResult = {
  room: Room
  game?: Game
}

export function joinRoom({ roomId, user }: JoinRoomInput): JoinRoomResult {
  if (!isRoomExists(roomId)) {
    throw new Error('Room not found')
  }

  if (isUserInRoom(roomId, user.id)) {
    throw new Error('User already in room')
  }

  const room = addUserToRoom(roomId, user)
  const shouldStartGame = room.users.length === 2
  const game = shouldStartGame ? createGame(room.id) : undefined

  if (shouldStartGame && !game) {
    throw new Error('Game not created')
  }

  return {
    room,
    game,
  }
}
