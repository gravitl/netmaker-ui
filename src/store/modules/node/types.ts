import { Modify } from '../../../types/react-app-env'

export interface Node {
  id: string
  address: string
  address6: string
  localaddress: string
  name: string
  listenport: number
  publickey: string
  endpoint: string
  postup: string
  postdown: string
  allowedips: []
  persistentkeepalive: number
  accesskey: string
  interface: string
  lastmodified: number
  keyupdatetimestamp: number
  expdatetime: number
  lastpeerupdate: number
  lastcheckin: number
  macaddress: string
  checkininterval: number
  password: string
  network: string
  ispending: string
  isrelay: boolean
  isrelayed: boolean
  relayaddrs: []
  isegressgateway: boolean
  isingressgateway: boolean
  egressgatewayranges: []
  ingressgatewayrange: string
  isstatic: boolean
  udpholepunch: boolean
  dnson: boolean
  isdualstack: boolean
  isserver: boolean
  action: string
  islocal: boolean
  localrange: string
  ipforwarding: boolean
  os: string
  mtu: number
  version: string
  commid: string
  isdocker: boolean
  isk8s: boolean
  ishub: boolean
}

export type NodePayload = Modify<
  Node,
  {
    isegressgateway: 'yes' | 'no'
    isingressgateway: 'yes' | 'no'
    isstatic: 'yes' | 'no'
    udpholepunch: 'yes' | 'no'
    dnson: 'yes' | 'no'
    isdualstack: 'yes' | 'no'
    isserver: 'yes' | 'no'
    islocal: 'yes' | 'no'
    ipforwarding: 'yes' | 'no'
    isrelayed: 'yes' | 'no'
    isrelay: 'yes' | 'no'
    isdocker: 'yes' | 'no'
    isk8s: 'yes' | 'no'
    ishub: 'yes' | 'no'
  }
>

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
}

export interface GetNodesPayload {
  Request: {
    token: string
  }
  Response: Array<NodePayload>
}

export interface UpdateNodePayload {
  Request: {
    token: string
    netid: string
    node: Node
  }
  Response: NodePayload
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
  Response: NodePayload
}

export interface CreateEgressNodePayload {
  Request: {
    netid: string
    nodeid: string
    payload: {
      ranges: Array<string>
      interface: string
      natEnabled: boolean
    }
  }
  Response: NodePayload
}

export interface CreateRelayNodePayload {
  Request: {
    netid: string
    nodeid: string
    payload: {
      ranges: Array<string>
    }
  }
  Response: NodePayload
}

export interface DeleteRelayNodePayload {
  Request: {
    netid: string
    nodeid: string
  }
  Response: NodePayload
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
  }
  Response: NodePayload
}

export interface DeleteIngressNodePayload {
  Request: {
    netid: string
    nodeid: string
  }
  Response: NodePayload
}

export type shouldSignOut = '' | 'network' | 'auth'

export interface NodeSort {
  value: 'name' | 'address' | 'network'
  ascending: boolean
}
