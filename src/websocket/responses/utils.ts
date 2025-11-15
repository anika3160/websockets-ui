
import { WebSocket } from 'ws'

interface ServerResponse {
  type: string
  data: string
  id: number | string
}

function createServerResponse(
  type: string,
  data: object,
  id: number | string = 0,
): ServerResponse {
  return {
    type,
    data: JSON.stringify(data),
    id
  }
}

export function sendResponse(ws: WebSocket, type: string, data: object) {
  const response = createServerResponse(type, data, 0)

  console.log('Response:', response)
  ws.send(JSON.stringify(response))
}