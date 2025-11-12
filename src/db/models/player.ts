export enum shipsSizes {
  small = 'small',
  medium = 'medium',
  large = 'large',
  huge = 'huge',
}

export interface Player {
  userId: number | string
  idPlayer: number | string
  idGame: number | string
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
