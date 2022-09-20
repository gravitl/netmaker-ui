export interface User {
  name: string
  isAdmin: boolean
  exp: number
  networks: null | Array<string>
  groups: null | Array<string>
}

export interface LocalStorageUserKeyValue {
  token: string
  user: User
}

export interface UserSettings {
  rowsPerPage: number
  username: string
  mode: 'dark' | 'light' | undefined
}

export interface LocalSettings {
  userSettings: UserSettings[]
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
  Response: Omit<CreateUser['Request'], 'password'>
}

export interface DeleteUser {
  Request: {
    username: string
  }
  Response: {
    username: string
  }
}

export interface UpdateUser {
  Request: {
    username: string
    password: string
  }
  Response: User
}

export interface UpdateUserNetworks {
  Request: {
    username: string
    isadmin: boolean
    networks: Array<string>
    groups: Array<string>
  }
  Response: UpdateUserNetworks['Request']
}
