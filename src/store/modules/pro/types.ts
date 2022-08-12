import { MutableRequired } from '../acls'
import { Node, ExternalClient, Network } from '../../types'

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
}

export interface NetworkUserData {
  nodes: Array<Node>
  clients: Array<ExternalClient>
  vpns: Array<Node>
  networks: Array<Network>
  user: NetworkUser
}

export type NetworksUsersMap = MutableRequired<{
  [networkName: string]: NetworkUser[]
}>

export type NetworkUserDataMap = MutableRequired<{
  [networkName: string]: NetworkUserData
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

export interface NetworkUserGetPayload {
  Request: { networkUserID: string }
  Response: NetworkUserDataMap
}
