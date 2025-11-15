import { Coordinates } from '../../db/index.js'
import { boardArea } from './ship.js'

export function collectAvailableCells(attackedPositions: Set<string>): Coordinates[] {
  const cells: Coordinates[] = []
  const { min, max } = boardArea

  for (let x = min; x <= max; x += 1) {
    for (let y = min; y <= max; y += 1) {
      const key = `${x}_${y}`
      if (!attackedPositions.has(key)) {
        cells.push({ x, y })
      }
    }
  }

  return cells
}

export function getRandomAvailableCell(attackedPositions: Set<string>): Coordinates | null {
  const cells = collectAvailableCells(attackedPositions)
  if (cells.length === 0) return null

  const index = Math.floor(Math.random() * cells.length)
  return cells[index]
}
