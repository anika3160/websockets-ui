import { addUserToRoom, createNewEmptyRoomAndSaveInDB, User } from '../../db/index.js'

export function createRoomAndAssignUser(currentUser: User) {
  console.log('Create room event received by user:', currentUser)
  const currentRoom = createNewEmptyRoomAndSaveInDB()
  console.log('Current room:', currentRoom)
  addUserToRoom(currentRoom.id, {
    name: currentUser.name,
    id: currentUser.id,
  })
  return currentRoom
}
