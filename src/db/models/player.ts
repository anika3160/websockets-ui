import { Id } from './common.js'
import { Coordinates } from './game.js'
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
  isBot?: boolean
  ships: {
    position: Coordinates
    direction: boolean
    length: number
    type: shipsSizes
    hits?: Coordinates[]
  }[]
}
