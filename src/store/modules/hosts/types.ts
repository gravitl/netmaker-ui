import { Interface, Node } from '../node/types'

/**
 * Host is the configuration for a netclient host machine.
 * unlike the Node type, a host is independent of a network
 * a host may have different representations on different networks as Nodes
 */
export interface Host {
  id: string
  verbosity: number
  firewallinuse: string
  version: string
  name: string
  os: string
  debug: boolean
  isstatic: boolean
  listenport: number
  locallistenport: number
  proxy_listen_port: number
  mtu: number
  interfaces: Interface[]
  defaultinterface: string // iface name
  endpointip: string
  publickey: string
  macaddress: string
  internetgateway: string
  nodes: string[] // node ids
  proxy_enabled: boolean
  isdefault: boolean
  isrelayed: boolean
  relayed_by: string // host id
  isrelay: boolean
  relay_hosts: string[] // host ids
}

export interface NodeCommonDetails {
  name: Host['name']
  version: Host['version']
  endpointip: Host['endpointip']
  publickey: Host['publickey']
  os: Host['os']
  listenport: Host['listenport']
  isstatic: Host['isstatic']
  mtu: Host['mtu']
  interfaces: Host['interfaces']
  isrelay: Host['isrelay']
  relay_hosts: Host['relay_hosts']
  isrelayed: Host['isrelayed']
  macaddress: Host['macaddress']
}

export interface GetHostsPayload {
  Request: void
  Response: Host[]
}

export interface UpdateHostPayload {
  Request: Host
  Response: Host
}

export interface RefreshHostKeysPayload {
  Request: { id: Host['id'] }
  Response: void
}

export interface UpdateHostNetworksPayload {
  Request: {
    id: Host['id']
    network: Node['network']
    action: 'join' | 'leave'
  }
  Response: void
}

export interface DeleteHostPayload {
  Request: {
    hostid: string
  }
  Response: Host
}

export interface CreateHostRelayPayload {
  Request: {
    hostid: Host['id']
    relayed_hosts: Host['id'][]
  }
  Response: Host
}

export interface DeleteHostRelayPayload {
  Request: {
    hostid: Host['id']
  }
  Response: Host
}
