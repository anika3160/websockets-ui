import { Coordinates } from '../../db/index.js'
import { BOARD_MAX, BOARD_MIN } from '../../utils/constants.js'

type ShipCells = Coordinates[]

export const boardArea = {
  min: BOARD_MIN,
  max: BOARD_MAX,
}

export function getShipCells(ship: any): ShipCells {
  const cells: ShipCells = []
  const { x, y } = ship.position
  const isVertical = Boolean(ship.direction)
  console.log(
    `[getShipCells] Ship: position=(${x},${y}), length=${ship.length}, direction=${ship.direction}, orientation=${
      isVertical ? 'vertical' : 'horizontal'
    }`,
  )
  for (let i = 0; i < ship.length; i += 1) {
    cells.push(isVertical ? { x, y: y + i } : { x: x + i, y })
  }
  console.log(`[getShipCells] Calculated cells:`, cells)
  return cells
}

export function getMissCellsAroundShip(shipCells: ShipCells): ShipCells {
  const boardSize = BOARD_MAX - BOARD_MIN + 1

  const hasShip: boolean[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(false))

  const isMiss: boolean[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(false))

  for (const cell of shipCells) {
    const ix = cell.x - BOARD_MIN
    const iy = cell.y - BOARD_MIN
    hasShip[ix][iy] = true
  }

  const misses: ShipCells = []

  for (const cell of shipCells) {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (dx === 0 && dy === 0) continue

        const nx = cell.x + dx
        const ny = cell.y + dy

        if (nx < BOARD_MIN || nx > BOARD_MAX || ny < BOARD_MIN || ny > BOARD_MAX) {
          continue
        }

        const ix = nx - BOARD_MIN
        const iy = ny - BOARD_MIN

        if (hasShip[ix][iy]) continue

        if (isMiss[ix][iy]) continue

        isMiss[ix][iy] = true
        misses.push({ x: nx, y: ny })
      }
    }
  }

  return misses
}
