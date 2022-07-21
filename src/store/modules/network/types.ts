import { ExternalClient } from '~store/types'
import { Modify } from '../../../types/react-app-env'

export interface Network {
  addressrange: string
  addressrange6: string
  netid: string
  nodeslastmodified: number
  networklastmodified: number
  defaultinterface: string
  defaultlistenport: number
  nodelimit: number
  defaultpostup: string
  defaultpostdown: string
  defaultkeepalive: number
  accesskeys: Array<AccessKey>
  externalclients: Array<ExternalClient>
  allowmanualsignup: boolean
  islocal: boolean
  isipv4: boolean
  isipv6: boolean
  ispointtosite: boolean
  localrange: string
  defaultudpholepunch: boolean
  defaultextclientdns: string
  defaultmtu: number
  defaultacl: boolean
  prosettings: ProSettings | undefined
}

export type NetworkPayload = Modify<
  Network,
  {
    allowmanualsignup: 'no' | 'yes'
    islocal: 'no' | 'yes'
    isipv4: 'no' | 'yes'
    isipv6: 'no' | 'yes'
    defaultudpholepunch: 'no' | 'yes'
    ispointtosite: 'no' | 'yes'
    defaultacl: 'no' | 'yes'
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
  Request: void
  Response: void
}

export interface CreateNetworkPayload {
  Request: {
    addressrange: string
    netid: string
    localrange: string
    islocal: 'yes' | 'no'
    isipv4: 'yes' | 'no'
    isipv6: 'yes' | 'no'
    addressrange6: string
    defaultudpholepunch: 'yes' | 'no'
    ispointtosite: 'yes' | 'no'
    defaultacl: 'yes' | 'no'
    prosettings?: ProSettings
  }
  Response: NetworkPayload
}

export interface TempKey {
  value: string
  accessString: string
}

export interface DNS {
  address: string
  network: string
  name: string
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

export interface GetDnsEntriesPayload {
  Request: void
  Response: Array<DNS>
}

export interface CreateDNSEntryPayload {
  Request: DNS
  Response: DNS
}

export interface DeleteDNSEntryPayload {
  Request: {
    domain: string
    netid: string
  }
  Response: {
    domain: string
  }
}

export interface RefreshPublicKeysPayload {
  Request: {
    netid: string
  }
  Response: NetworkPayload
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

export interface ProSettings {
  defaultaccesslevel: number
  defaultusernodelimit: number
  defaultuserclientlimit: number
  allowedusers: string[]
  allowedgroups: string[]
}
