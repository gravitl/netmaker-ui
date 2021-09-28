import { Modify } from "../../../react-app-env";

export interface Network {
  addressrange: string
  addressrange6: string
  displayname: string
  netid: string
  nodeslastmodified: number,
  networklastmodified: number,
  defaultinterface: string
  defaultlistenport: number,
  nodelimit: number,
  defaultpostup: string
  defaultpostdown: string
  keyupdatetimestamp: number
  defaultkeepalive: number
  defaultsaveconfig: boolean
  accesskeys: [
  ],
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

export type NetworkPayload = Modify<Network, {
  defaultsaveconfig: "no" | "yes"
  allowmanualsignup: "no" | "yes"
  islocal: "no" | "yes"
  isdualstack: "no" | "yes"
  isipv4: "no" | "yes",
  isipv6: "no" | "yes"
  isgrpchub: "no" | "yes"
  defaultudpholepunch: "no" | "yes"
}>

export interface GetNetworksPayload {
  Request: {
    token: string
  },
  Response: Array<NetworkPayload>
}

export interface UpdateNetworkPayload {
  Request: {
    token: string
    network: NetworkPayload
  },
  Response: NetworkPayload
}

export interface DeleteNetworkPayload {
  Request: {
    token: string
    netid: string
  },
  Response: void
}