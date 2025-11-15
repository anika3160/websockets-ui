import { Game, Id, Player } from '../db/models/index.js'
import { games } from '../db/storage/games.js'
import { idsEqual } from '../utils/index.js'
import { getUsersInRoomByRoomId } from './room.js'

let lastGameId = 100
let lastPlayerSessionId = 1000

const nextGameId = (): number => ++lastGameId
const nextPlayerSessionId = (): number => ++lastPlayerSessionId

const createPlayer = (userId: Id, idGame: Id): Player => ({
  userId,
  idPlayer: nextPlayerSessionId(),
  idGame,
  ships: [],
})

export const findGameById = (gameId: Id): Game | undefined => games.find((g) => idsEqual(g.idGame, gameId))

export function createGame(roomId: Id): Game | undefined {
  const usersInRoom = getUsersInRoomByRoomId(roomId)

  if (!usersInRoom || usersInRoom.length < 2) {
    return undefined
  }

  const gameId = nextGameId()
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

export function getGameById(gameId: Id): Game | undefined {
  return findGameById(gameId)
}

export function findGameByPlayerUserId(userId: Id): { game: Game; player: Player } | undefined {
  for (const game of games) {
    const player = game.players.find((p) => idsEqual(p.userId, userId))
    if (player) {
      return { game, player }
    }
  }
  return undefined
}

export function removeGame(gameId: Id): void {
  const index = games.findIndex((g) => idsEqual(g.idGame, gameId))
  if (index !== -1) {
    games.splice(index, 1)
  }
}
