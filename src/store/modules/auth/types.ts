
export interface User {
  name: string
  isAdmin: boolean
  exp: number
}


export interface LocalStorageUserKeyValue {
  token: string
  user: User
}