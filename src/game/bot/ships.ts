import { Player, shipsSizes } from '../../db/index.js'
import { BOARD_MAX, BOARD_MIN } from '../../utils/constants.js'

type ShipConfig = {
  type: shipsSizes
  length: number
  count: number
}

const SHIP_CONFIG: ShipConfig[] = [
  { type: shipsSizes.huge, length: 4, count: 1 },
  { type: shipsSizes.large, length: 3, count: 2 },
  { type: shipsSizes.medium, length: 2, count: 3 },
  { type: shipsSizes.small, length: 1, count: 4 },
]

const MAX_ATTEMPTS = 100

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function canPlaceShip(x: number, y: number, length: number, isVertical: boolean, occupiedCells: Set<string>): boolean {
  for (let i = 0; i < length; i += 1) {
    const cx = isVertical ? x : x + i
    const cy = isVertical ? y + i : y

    if (cx < BOARD_MIN || cx > BOARD_MAX || cy < BOARD_MIN || cy > BOARD_MAX) {
      return false
    }

    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const nx = cx + dx
        const ny = cy + dy

        if (nx < BOARD_MIN || nx > BOARD_MAX || ny < BOARD_MIN || ny > BOARD_MAX) {
          continue
        }

        if (occupiedCells.has(`${nx}_${ny}`)) {
          return false
        }
      }
    }
  }
  return true
}

function occupyCells(x: number, y: number, length: number, isVertical: boolean, occupiedCells: Set<string>) {
  for (let i = 0; i < length; i += 1) {
    const cx = isVertical ? x : x + i
    const cy = isVertical ? y + i : y
    occupiedCells.add(`${cx}_${cy}`)
  }
}

function placeShip(length: number, occupiedCells: Set<string>) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const isVertical = Math.random() >= 0.5
    const x = isVertical ? getRandomInt(BOARD_MIN, BOARD_MAX) : getRandomInt(BOARD_MIN, BOARD_MAX - length + 1)
    const y = isVertical ? getRandomInt(BOARD_MIN, BOARD_MAX - length + 1) : getRandomInt(BOARD_MIN, BOARD_MAX)

    if (canPlaceShip(x, y, length, isVertical, occupiedCells)) {
      occupyCells(x, y, length, isVertical, occupiedCells)
      return {
        position: { x, y },
        direction: isVertical,
      }
    }
  }

  throw new Error('Failed to place ship for bot')
}

export function generateRandomShips(): Player['ships'] {
  const ships: Player['ships'] = []
  const occupiedCells = new Set<string>()

  for (const config of SHIP_CONFIG) {
    for (let i = 0; i < config.count; i += 1) {
      const placedShip = placeShip(config.length, occupiedCells)
      ships.push({
        ...placedShip,
        length: config.length,
        type: config.type,
      })
    }
  }

  return ships
}
