import { Id } from './common.js'
export interface Room {
  id: Id
  users: {
    name: string
    id: Id
  }[]
}
