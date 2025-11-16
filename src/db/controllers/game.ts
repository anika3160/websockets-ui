import { isIdsEqual } from '../../utils/index.js'
import { Game, Id } from '../models/index.js'
import { games } from '../storage/games.js'
import { createPlayer } from './player.js'
import { getUsersInRoomByRoomId } from './room.js'

let lastGameId = 100
const getNextGameId = (): number => ++lastGameId

type GamePlayerConfig = {
  userId: Id
  isBot?: boolean
}

export function createCustomGame(players: GamePlayerConfig[], roomId?: Id): Game {
  if (!players || players.length < 2) {
    throw new Error('At least two players are required to create a game')
  }

  const gameId = getNextGameId()

  const game: Game = {
    idGame: gameId,
    roomIndex: roomId ?? `game-${gameId}`,
    players: players.map(({ userId, isBot }) => createPlayer(userId, gameId, { isBot })),
    attackedPositions: {},
  }

  games.push(game)
  return game
}

export function createGame(roomId: Id): Game | undefined {
  const usersInRoom = getUsersInRoomByRoomId(roomId)

  if (!usersInRoom || usersInRoom.length < 2) {
    return undefined
  }

  return createCustomGame(
    usersInRoom.map((user) => ({
      userId: user.id,
    })),
    roomId,
  )
}

export const getGameById = (gameId: Id): Game | undefined => games.find((g) => isIdsEqual(g.idGame, gameId))

export function removeGame(gameId: Id): void {
  const index = games.findIndex((g) => isIdsEqual(g.idGame, gameId))
  if (index !== -1) {
    games.splice(index, 1)
  }
}
