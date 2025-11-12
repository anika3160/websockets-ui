import { Game, Player } from '../models/index.js'
import { games } from '../storage/games.js'
import { getUsersInRoomByRoomId } from './roomService.js'

const createPlayer = (userId: number | string, idPlayer: number | string, idGame: number | string): Player => {
  return {
    userId,
    idPlayer,
    idGame,
    ships: [],
  }
}
let lastGameId = 100

export function createGame(roomId: number | string): Game | undefined {
  const gameId = lastGameId++
  const usersInRoom = getUsersInRoomByRoomId(roomId)
  if (!usersInRoom) {
    return undefined
  }
  console.log('\n')
  console.log('--------------------------')
  console.log('Users in room:', usersInRoom)
  const player1 = usersInRoom[0]
  const player2 = usersInRoom[1]
  const game: Game = {
    idGame: gameId,
    roomIndex: roomId,
    players: [],
  }
  games.push(game)
  game.players = [createPlayer(player1.id, player1.id, gameId), createPlayer(player2.id, player2.id, gameId)]
  console.log('Game created:', game)
  return game
}

export function addShipsToPlayer(gameId: number | string, indexPlayer: number | string, ships: Player['ships']) {
  const game = games.find((g) => String(g.idGame) === String(gameId))
  if (!game) {
    console.error('Game not found', { gameId, games: games.map((g) => g.idGame) })
    throw new Error('Game not found')
  }
  const player = game.players.find((p) => String(p.idPlayer) === String(indexPlayer))
  if (!player) {
    console.error('Player not found', { indexPlayer, players: game.players.map((p) => p.idPlayer) })
    throw new Error('Player not found')
  }
  player.ships = ships
}

export function getGameById(gameId: number | string) {
  return games.find((g) => g.idGame === gameId)
}
