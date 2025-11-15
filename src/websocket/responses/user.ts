import { WebSocket } from 'ws'
import { createUser, getUserByName, User } from '../../db/index.js'
import { manageGameEvents } from '../../utils/constants.js'
import { parseJSONData } from '../../utils/index.js'
import { sendResponse } from './utils.js'


export function sendRegistrationResponse(ws: WebSocket, data: any): User | null {
  const registrationData = parseJSONData(data.data)
  const { name, password } = registrationData || {}

  if (!name || !password) {
    sendResponse(ws, manageGameEvents.registration, {
      name,
      index: '',
      error: true,
      errorText: 'Name and password are required',
    })
    return null
  }

  if (getUserByName(name)) {
    sendResponse(ws, manageGameEvents.registration, {
      name,
      index: '',
      error: true,
      errorText: 'User already exists',
    })
    return null
  }

  const user = createUser(name, password)
  sendResponse(ws, manageGameEvents.registration, {
    name,
    index: user.id,
    error: false,
    errorText: '',
  })
  return user
}
