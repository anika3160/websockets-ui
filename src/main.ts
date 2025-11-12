import dotenv from 'dotenv'
import { httpServer } from './http_server/index.js'
import { startWebSocketServer } from './websocket_server/main.js'

dotenv.config()

const HTTP_PORT = 8181

const SOCKET_PORT = process.env.PORT ? Number(process.env.PORT) : 3000

startWebSocketServer(SOCKET_PORT)
console.log(`Start WebSocket server on the ${SOCKET_PORT} port!`)

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)
