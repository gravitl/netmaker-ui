import { User } from "../auth/types";

export interface GetPayload {
  url: string;
}

export interface GetAllUsers {
  Request: {
    token: string
  },
  Response: Array<User>
}

export interface GetUser {
  Request: {
    token: string
  },
  Response: User
}

export interface Login {
  Request: {
    username: string
    password: string
  },
  Response: {
    token: string
    user: User
  }
}

export interface GetServerConfig {
  Request: {
    token: string
  },
  Response: {
    APIConnString: string
    APIHost: string
    APIPort: string
    AgentBackend: string
    AllowedOrigin: string
    ClientMode: string
    CoreDNSAddr: string
    DNSMode: string
    Database: string
    DefaultNodeLimit: number
    DisableDefaultNet: string
    DisableRemoteIPCheck: string
    GRPCConnString: string
    GRPCHost: string
    GRPCPort: string
    GRPCSSL: string
    GRPCSecure: string
    MasterKey: string
    Platform: string
    RestBackend: string
    SQLConn: string
    Verbosity: number
    Version: string
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
  Response: {

  }
}

export interface CreateUser {
  Request: {
    token: string
    username: string
    password: string
    networks: Array<string>
  }
  Response: {

  }
}

export interface DeleteUser {
  Request: {
    token: string
    username: string
  }
  Response: {

  }
}

export interface UpdateUser {
  Request: {
    token: string
    newUsername: string
    oldUsername: string
    password: string
  }
  Response: User
}