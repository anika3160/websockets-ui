import { manageGameEvents } from '../utils/constants.js'

export interface ServerRegistrationResponse {
  type: string
  data: string
  id: number | string
}

export function createServerRegistrationResponse(
  name: string,
  index: number | string,
  error: boolean = false,
  errorText: string = '',
  id: number | string = 0,
): ServerRegistrationResponse {
  return {
    type: manageGameEvents.registration,
    data: JSON.stringify({
      name,
      index,
      error,
      errorText,
    }),
    id,
  }
}
