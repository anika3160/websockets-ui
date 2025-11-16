import { users } from '../../db/index.js'

export function validateUserName(name: unknown) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('Username is required and must be a non-empty string.')
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Password is required and must be a non-empty string.')
  }
}

export function validateUser(name: unknown, password: unknown) {
  validateUserName(name)
  validatePassword(password)
  if (users.find((u) => u.name === name)) {
    throw new Error('Username already exists.')
  }
}
