import { Interface, Node } from '../node/types'

/**
 * Host is the configuration for a netclient host machine.
 * unlike the Node type, a host is independent of a network
 * a host may have different representations on different networks as Nodes
 */
export interface Host {
  id: string
  name: string
  os: string
  verbosity: number
  firewallinuse: string
  version: string
  ipforwarding: boolean
  daemoninstalled: boolean
  hostpass: string
  debug: boolean
  nodepassword: string
  listenport: number
  localaddress: string
  localrange: string
  locallistenport: number
  proxy_listen_port: number
  mtu: number
  publickey: string
  macaddress: string
  traffickeypublic: string
  internetgateway: string
  nodes: Node[]
  isdefault: boolean
  interfaces: Interface[]
  proxyenabled: boolean
  isstatic: boolean
}

export interface GetHostsPayload {
  Request: void
  Response: Host[]
}

export interface UpdateHostPayload {
  Request: Host
  Response: Host
}

export interface DeleteHostPayload {
  Request: {
    hostid: string
  }
  Response: Host
}
