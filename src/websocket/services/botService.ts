import { Game, Id, Player, User, createCustomGame, getGameById } from '../../db/index.js'
import { startAttack } from '../../game/actions/startAttack.js'
import { generateRandomShips } from '../../game/bot/ships.js'
import { getPlayerAttackHistory } from '../../game/helpers/attack.js'
import { getRandomAvailableCell } from '../../game/helpers/board.js'
import { assignShipsToPlayer } from '../../game/helpers/player.js'
import { isIdsEqual, normalizeId } from '../../utils/index.js'
import { dispatchAttackResult } from '../gameDispatch.js'

const BOT_USER_PREFIX = 'bot-'
const BOT_TURN_DELAY_MS = 800

export function buildBotUserId(gameIdSeed: Id): string {
  return `${BOT_USER_PREFIX}${normalizeId(gameIdSeed)}-${Date.now()}`
}

export function isBotPlayer(player: Player): boolean {
  return Boolean(player.isBot) || String(player.userId).startsWith(BOT_USER_PREFIX)
}

export function getBotPlayer(game: Game): Player | undefined {
  return game.players.find(isBotPlayer)
}

export function createSinglePlayerGame(user: Pick<User, 'id' | 'name'>): {
  game: Game
  userPlayer: Player
  botPlayer: Player
} {
  const botUserId = buildBotUserId(user.id)

  const game = createCustomGame([{ userId: user.id }, { userId: botUserId, isBot: true }], `bot-room-${botUserId}`)

  const userPlayer = game.players.find((player) => isIdsEqual(player.userId, user.id))
  const botPlayer = getBotPlayer(game)

  if (!userPlayer || !botPlayer) {
    throw new Error('Failed to initialize single player game')
  }

  assignShipsToPlayer(game, botPlayer.idPlayer, generateRandomShips())

  return { game, userPlayer, botPlayer }
}

function performBotAttack(gameId: Id) {
  const game = getGameById(gameId)

  if (!game || game.isFinished) return

  const botPlayer = getBotPlayer(game)
  if (!botPlayer) return

  const attackHistory = getPlayerAttackHistory(game, botPlayer.idPlayer)
  const target = getRandomAvailableCell(attackHistory)

  if (!target) return

  const { game: updatedGame, attackResult } = startAttack({
    gameId: game.idGame,
    attackerId: botPlayer.idPlayer,
    x: target.x,
    y: target.y,
  })

  dispatchAttackResult(updatedGame, attackResult)
}

export function maybeHandleBotTurn(game: Game) {
  if (game.isFinished || !game.currentPlayer) return

  const botPlayer = getBotPlayer(game)
  if (!botPlayer) return

  if (!isIdsEqual(game.currentPlayer, botPlayer.idPlayer)) return

  setTimeout(() => performBotAttack(game.idGame), BOT_TURN_DELAY_MS)
}
