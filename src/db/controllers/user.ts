import { validateUser } from '../../utils/validation/userValidation.js'
import { User } from '../models/index.js'
import { users } from '../storage/users.js'

export function createUser(name: string, password: string): User {
  validateUser(name, password)
  const id = users.length + 1
  const user: User = { name, password, id }
  users.push(user)
  return user
}

export function getUserByName(name: string): User | undefined {
  return users.find((u) => u.name === name)
}
