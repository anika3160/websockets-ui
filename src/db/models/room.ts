export interface Room {
  id: number | string
  users: {
    name: string
    id: number | string 
}[]
}