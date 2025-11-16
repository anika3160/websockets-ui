import { Id } from '../models/index.js'
export interface WinnerScore {
  userId: Id
  wins: number
}

export const winners: WinnerScore[] = []
