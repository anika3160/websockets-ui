import { WebSocket } from 'ws'
import { placeShips } from '../../game/actions/placeShips.js'
import { manageGameEvents } from '../../utils/constants.js'
import { sendErrorResponse, sendResponse, sendTurnInfo } from '../responses/index.js'
import { getUserSocket } from '../wsSessions.js'

export function addShipsEvent(ws: WebSocket, data: any) {
  try {
    const jsonData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data
    const { gameId, ships, indexPlayer } = jsonData
    const { game, allPlayersReady } = placeShips({
      gameId,
      playerId: indexPlayer,
      ships,
    })

    if (allPlayersReady) {
      const currentPlayerId = game.currentPlayer
      for (const player of game.players) {
        const wsPlayer = getUserSocket(player.userId)
        if (wsPlayer) {
          sendResponse(wsPlayer, manageGameEvents.startGame, {
            ships: player.ships,
            currentPlayerIndex: player.idPlayer,
          })
          if (currentPlayerId !== undefined) {
            sendTurnInfo(wsPlayer, currentPlayerId)
          }
        }
      }
    }
  } catch (err) {
    console.error('Error in addShipsToPlayer:', err)
    const message = err instanceof Error ? err.message : 'Error saving ships'
    sendErrorResponse(ws, message)
  }
}
