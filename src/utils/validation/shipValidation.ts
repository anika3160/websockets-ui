import { BOARD_MIN, BOARD_MAX } from '../constants.js'


export const isWithinBoard = (x: number, y: number) => x >= BOARD_MIN && x <= BOARD_MAX && y >= BOARD_MIN && y <= BOARD_MAX