import { Id } from '../db/index.js'

export type IncomingMessage = {
  type?: string
  [key: string]: unknown
}

export const parseJSONData = (data: any): any => {
  try {
    return JSON.parse(data)
  } catch (err) {
    console.error('Error parsing JSON:', err)
    return data
  }
}

export function parseIncomingMessage(rawData: unknown): IncomingMessage {
  const text = rawData?.toString?.() ?? ''
  return parseJSONData(text)
}

export const normalizeId = (value: Id) => String(value)

export const isIdsEqual = (a: Id, b: Id) => normalizeId(a) === normalizeId(b)

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export * from './constants.js'
