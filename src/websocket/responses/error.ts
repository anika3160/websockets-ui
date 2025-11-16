import { WebSocket } from 'ws'

export const sendErrorResponse = (ws: WebSocket, message: string) => {
    ws.send(JSON.stringify({ error: true, message }))
}