import { Game } from '../db/index.js'
import type { AttackResult } from '../game/actions/startAttack.js'
import { gameCommands } from '../utils/constants.js'
import { maybeHandleBotTurn } from './services/botService.js'
import { finalizeGame } from './gameLifecycle.js'
import { broadcastTurnInfo, sendRoomResponse } from './responses/index.js'

export function dispatchAttackResult(game: Game, payload: AttackResult) {
  const { position, currentPlayer, status, isFinished, nextPlayerId, missCells, winnerPlayerId, winnerUserId } = payload

  const makeAttackPayload = (cell: typeof position, cellStatus: typeof status | 'miss') => ({
    position: cell,
    currentPlayer,
    status: cellStatus,
    gameId: game.idGame,
  })

  const shouldSendMissCells = status === 'killed' && Array.isArray(missCells)
  const isGameFinished = isFinished && winnerPlayerId && winnerUserId

  sendRoomResponse(game, gameCommands.attack, makeAttackPayload(position, status))

  if (shouldSendMissCells) {
    for (const missCell of missCells!) {
      sendRoomResponse(game, gameCommands.attack, makeAttackPayload(missCell, 'miss'))
    }
  }

  if (!isFinished && nextPlayerId) {
    broadcastTurnInfo(game, nextPlayerId)
  }

  if (isGameFinished) {
    finalizeGame(game, winnerPlayerId!, winnerUserId!)
    return
  }

  maybeHandleBotTurn(game)
}
