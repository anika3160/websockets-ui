import { Id, users, winners } from '../../db/index.js'
import { idsEqual } from '../../utils/index.js'

export function incrementWinnerScore(userId: Id) {
  const existing = winners.find((entry) => idsEqual(entry.userId, userId))

  if (existing) {
    existing.wins += 1
    return
  }

  winners.push({
    userId,
    wins: 1,
  })
}

const getUserNameById = (id: Id): string => {
  const user = users.find((u) => idsEqual(u.id, id))
  return user?.name ?? `User #${id}`
}

export function getWinnersTable() {
  return winners
    .map((entry) => ({
      name: getUserNameById(entry.userId),
      wins: entry.wins,
    }))
    .sort((a, b) => b.wins - a.wins)
}
