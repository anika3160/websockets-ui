import { Id } from './common.js'
export enum shipsSizes {
  small = 'small',
  medium = 'medium',
  large = 'large',
  huge = 'huge',
}

export interface Player {
  userId: Id
  idPlayer: Id
  idGame: Id
  ships: {
    position: {
      x: number
      y: number
    }
    direction: boolean
    length: number
    type: shipsSizes
    hits?: { x: number; y: number }[]
  }[]
}
