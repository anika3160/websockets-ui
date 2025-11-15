export enum gameCommands {
  attack = 'attack',
  randomAttack = 'random_attack',
  turn = 'turn',
}

export enum manageGameEvents {
  registration = 'reg',
  createRoom = 'create_room',
  getRoomsList = 'update_room',
  addUserToRoom = 'add_user_to_room',
  createGame = 'create_game',
  addShips = 'add_ships',
  startGame = 'start_game',
  finishGame = 'finish',
  updateWinners = 'update_winners',
}

export const BOARD_MIN = 0
export const BOARD_MAX = 9
