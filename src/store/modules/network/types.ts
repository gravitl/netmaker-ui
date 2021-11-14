import { ExternalClient } from '~store/types'
import { Modify } from '../../../types/react-app-env'

export interface Network {
  addressrange: string
  addressrange6: string
  displayname: string
  netid: string
  nodeslastmodified: number
  networklastmodified: number
  defaultinterface: string
  defaultlistenport: number
  nodelimit: number
  defaultpostup: string
  defaultpostdown: string
  keyupdatetimestamp: number
  defaultkeepalive: number
  defaultsaveconfig: boolean
  accesskeys: Array<AccessKey>
  externalclients: Array<ExternalClient>
  metadata?: Metadata
  allowmanualsignup: boolean
  islocal: boolean
  isdualstack: boolean
  isipv4: boolean
  isipv6: boolean
  isgrpchub: boolean
  localrange: string
  checkininterval: number
  defaultudpholepunch: boolean
  defaultextclientdns: string
  defaultmtu: number
}

export type NetworkPayload = Modify<
  Network,
  {
    defaultsaveconfig: 'no' | 'yes'
    allowmanualsignup: 'no' | 'yes'
    islocal: 'no' | 'yes'
    isdualstack: 'no' | 'yes'
    isipv4: 'no' | 'yes'
    isipv6: 'no' | 'yes'
    isgrpchub: 'no' | 'yes'
    defaultudpholepunch: 'no' | 'yes'
    // defaultmtu: number
    // checkininterval: number
    // keyupdatetimestamp: number
    // defaultkeepalive: number
    // nodeslastmodified: number
    // networklastmodified: number
    // defaultlistenport: number
    // nodelimit: number
  }
>

export interface GetNetworksPayload {
  Request: void
  Response: Array<NetworkPayload>
}

export interface UpdateNetworkPayload {
  Request: {
    network: NetworkPayload
  }
  Response: NetworkPayload
}

export interface DeleteNetworkPayload {
  Request: {
    netid: string
  }
  Response: {
    netid: string
  }
}

export interface IndexNetworkPayload {
  Request: {
    netid: string
  }
  Response: {
    netid: string
  }
}

export interface CreateNetworkPayload {
  Request: {
    addressrange: string
    netid: string
    localrange: string
    islocal: 'yes' | 'no'
    isdualstack: 'yes' | 'no'
    addressrange6: string
    defaultudpholepunch: 'yes' | 'no'
  }
  Response: void
}

export interface Metadata {
  value?: string
  accessString?: string
}

export interface AccessKey {
  name: string
  value: string
  accessstring: string
  uses: number
}

export interface GetAccessKeysPayload {
  Request: {
    netid: string
  }
  Response: Array<AccessKey>
}

export interface CreateAccessKeyPayload {
  Request: {
    netid: string
    newAccessKey: {
      name: string
      uses: number
    }
  }
  Response: {
    netid: string 
    newAccessKey: AccessKey
  }
}

export interface DeleteAccessKeyPayload {
  Request: {
    netid: string
    name: string
  }
  Response: {
    netid: string
    name: string
  }
}
