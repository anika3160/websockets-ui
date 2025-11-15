import { Id } from '../db/index.js'

export const parseJSONData = (data: any): any => {
  try {
    return JSON.parse(data)
  } catch (err) {
    console.error('Error parsing JSON:', err)
    return data
  }
}

export const normalizeId = (value: Id) => String(value)

export const idsEqual = (a: Id, b: Id) => normalizeId(a) === normalizeId(b)

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}
