import { MutableRequired } from '../acls'

export type UserGroups = MutableRequired<{ [groupName: string]: void }>

export interface UserGroupsPayload {
  Request: void
  Response: UserGroups
}

export interface UserGroupDelorCreate {
  Request: { groupName: string }
  Response: { groupName: string }
}

export interface NetworkUser {
  accesslevel: number
  clientlimit: number
  nodelimit: number
  id: string
  clients: Array<string>
  nodes: Array<string>
  groups: Array<string>
}

// export type NetworkUserMap = MutableRequired<{
//   [networkUserID: string]: NetworkUser
// }>

export type NetworksUsersMap = MutableRequired<{
  [networkName: string]: NetworkUser[]
}>

export interface NetworkUsersPayload {
  Request: void
  Response: NetworksUsersMap
}

export interface NetworkUserDelPayload {
  Request: { networkName: string; networkUserID: string }
  Response: { networkName: string; networkUserID: string }
}

export interface NetworkUserUpdatePayload {
  Request: { networkName: string; networkUser: NetworkUser }
  Response: { networkName: string; networkUser: NetworkUser }
}
