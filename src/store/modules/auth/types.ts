
export interface User {
  name: string
  isAdmin: boolean
  exp: number
  networks: null | Array<string>
}


export interface LocalStorageUserKeyValue {
  token: string
  user: User
}