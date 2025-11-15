import { idsEqual } from '../../utils/index.js'
import { Game, Id } from '../models/index.js'
import { games } from '../storage/games.js'
import { createPlayer } from './player.js'
import { getUsersInRoomByRoomId } from './room.js'

let lastGameId = 100
const getNextGameId = (): number => ++lastGameId

export function createGame(roomId: Id): Game | undefined {
  const usersInRoom = getUsersInRoomByRoomId(roomId)

  if (!usersInRoom || usersInRoom.length < 2) {
    return undefined
  }

  const gameId = getNextGameId()
  const [firstUser, secondUser] = usersInRoom

  const game: Game = {
    idGame: gameId,
    roomIndex: roomId,
    players: [createPlayer(firstUser.id, gameId), createPlayer(secondUser.id, gameId)],
    attackedPositions: {},
  }

  games.push(game)
  return game
}

export const getGameById = (gameId: Id): Game | undefined => games.find((g) => idsEqual(g.idGame, gameId))

export function removeGame(gameId: Id): void {
  const index = games.findIndex((g) => idsEqual(g.idGame, gameId))
  if (index !== -1) {
    games.splice(index, 1)
  }
}
