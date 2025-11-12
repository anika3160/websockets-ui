import { User } from "../models/index.js"
import { users } from "../storage/users.js"

export function createUser(name: string, password: string): User {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Username is required and must be a non-empty string.')
  }
  if (!password || typeof password !== 'string' || password.trim() === '') {
    throw new Error('Password is required and must be a non-empty string.')
  }
  if (users.find((u) => u.name === name)) {
    throw new Error('Username already exists.')
  }
  const id = users.length + 1
  const user: User = { name, password, id }
  users.push(user)
  return user
}

export function getUserByName(name: string): User | undefined {
  return users.find((u) => u.name === name)
}
