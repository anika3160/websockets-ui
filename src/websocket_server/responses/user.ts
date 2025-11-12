import { WebSocket } from 'ws'
import { createUser, getUserByName } from '../../db/services/index.js'
import { manageGameEvents } from '../../utils/constants.js'
import { parseJSONData } from '../../utils/utils.js'
import { sendResponse } from './utils.js'
/*
 {
    type: "reg",
    data:
        {
            name: <string>,
            index: <number | string>,
            error: <bool>,
            errorText: <string>,
        },
    id: 0,
}
*/

export function sendRegistrationResponse(ws: WebSocket, dataObject: any) {
  const registrationData = parseJSONData(dataObject.data)
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
