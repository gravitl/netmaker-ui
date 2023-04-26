import { NodeCommonDetails } from "../hosts"

export interface Node {
  id: string
  hostid: string
  address: string
  address6: string
  localaddress: string
  persistentkeepalive: number
  interface: string
  macaddress: string
  lastmodified: number
  expdatetime: number
  lastcheckin: number
  lastpeerupdate: number
  network: string
  networkrange: string
  networkrange6: string
  pendingdelete: boolean
  isegressgateway: boolean
  isingressgateway: boolean
  egressgatewayranges: string[]
  egressgatewaynatenabled: boolean
  failovernode: string
  dnson: boolean
  server: string
  internetgateway: string
  defaultacl: string
  connected: boolean
  failover: boolean
}

export interface Interface {
  name: string
  address: { IP: string; Mask: string }
  addressString: string
}

export interface ExternalClient {
  clientid: string
  description: string
  privatekey: string
  publickey: string
  network: string
  address: string
  address6: string
  ingressgatewayid: string
  ingressgatewayendpoint: string
  lastmodified: number
  enabled: boolean
  ownerid: string
}

export interface GetNodesPayload {
  Request: {
    token: string
  }
  Response: Array<Node>
}

export interface UpdateNodePayload {
  Request: {
    token: string
    netid: string
    node: Node
  }
  Response: Node
}

export interface GetExternalClientsPayload {
  Request: {
    token: string
  }
  Response: null | Array<ExternalClient>
}

export interface GetExternalClientConfPayload {
  Request: {
    clientid: string
    netid: string
    token: string
    type: 'file' | 'qr'
  }
  Response: {
    data: string
    filename: string
    type: 'file' | 'qr'
  }
}

export interface ExtClientConfResponse {
  netid: string
  data: string
}

export interface CreateExternalClientPayload {
  Request: {
    netid: string
    nodeid: string
  }
  Response: void
}

export interface DeleteExternalClientPayload {
  Request: {
    netid: string
    clientName: string
  }
  Response: {
    clientid: string
  }
}

export interface UpdateExternalClientPayload {
  Request: {
    netid: string
    clientName: string
    newClientName: string
    enabled: boolean
  }
  Response: {
    previousId: string
    client: ExternalClient
  }
}

export interface DeleteEgressNodePayload {
  Request: {
    netid: string
    nodeid: string
  }
  Response: Node
}

export interface CreateEgressNodePayload {
  Request: {
    netid: string
    nodeid: string
    payload: {
      ranges: Array<string>
      natEnabled: string
    }
  }
  Response: Node
}

export interface CreateRelayNodePayload {
  Request: {
    netid: string
    nodeid: string
    payload: {
      ranges: Array<string>
    }
  }
  Response: Node
}

export interface DeleteRelayNodePayload {
  Request: {
    netid: string
    nodeid: string
  }
  Response: Node
}

export interface DeleteNodePayload {
  Request: {
    netid: string
    nodeid: string
  }
  Response: {
    nodeid: string
  }
}

export interface CreatIngressNodePayload {
  Request: {
    netid: string
    nodeid: string
    failover?: boolean
  }
  Response: Node
}

export interface DeleteIngressNodePayload {
  Request: {
    netid: string
    nodeid: string
  }
  Response: Node
}

export type shouldSignOut = '' | 'network' | 'auth'

export interface NodeSort {
  value: 'address' | 'network' | 'name'
  ascending: boolean
  hostsMap: Record<string, NodeCommonDetails>
}

export const nodeACLValues = {
  unset: 'UNSET',
  allow: 'ALLOW',
  deny: 'DENY',
}

export type NodeConnectivityStatus = 'healthy' | 'warning' | 'error' | 'unknown'
