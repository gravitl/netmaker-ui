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

export interface GetAllUsers {
  Request: void
  Response: Array<User>
}

export interface GetUser {
  Request: void
  Response: User
}

export interface Login {
  Request: {
    username: string
    password: string
  }
  Response: {
    token: string
  }
}

export interface HasAdmin {
  Request: void
  Response: boolean
}

export interface CreateAdmin {
  Request: {
    username: string
    password: string
  }
  Response: {}
}

export interface CreateUser {
  Request: {
    username: string
    password: string
    isadmin: boolean
    networks: Array<string>
  }
  Response: Omit<CreateUser["Request"], 'password'>
}

export interface DeleteUser {
  Request: {
    username: string
  }
  Response: {}
}

export interface UpdateUser {
  Request: {
    newUsername: string
    oldUsername: string
    password: string
  }
  Response: User
}
