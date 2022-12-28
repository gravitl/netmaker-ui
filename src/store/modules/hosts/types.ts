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
  localrange: string
  locallistenport: number
  proxy_listen_port: number
  mtu: number
  interfaces: Interface[]
  endpointip: string
  publickey: string
  macaddress: string
  internetgateway: string
  // nodes: Node[]
  nodes: string[] // network names
  proxy_enabled: boolean
  isdefault: boolean

  // localaddress: string
  // listenaddress: number
  // ipforwarding: boolean
  // daemoninstalled: boolean
  // hostpass: string
  // nodepassword: string
  // traffickeypublic: string
}

export interface GetHostsPayload {
  Request: void
  Response: Host[]
}

export interface UpdateHostPayload {
  Request: Host
  Response: Host
}

export interface UpdateHostNetworksPayload {
  Request: {
    id: Host['id']
    networks: Node['network'][]
  }
  Response: Node['network'][]
}

export interface DeleteHostPayload {
  Request: {
    hostid: string
  }
  Response: Host
}
