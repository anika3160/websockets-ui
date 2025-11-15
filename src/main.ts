import dotenv from 'dotenv'
import { httpServer } from './http/index.js'
import { startWebSocketServer } from './websocket/server.js'

dotenv.config()

const HTTP_PORT = 8181
const SOCKET_PORT = process.env.PORT ? Number(process.env.PORT) : 3000

startWebSocketServer(SOCKET_PORT)
httpServer.listen(HTTP_PORT)

console.log(`Start WebSocket server on the ${SOCKET_PORT} port!`)
console.log(`Start static http server on the ${HTTP_PORT} port!`)
