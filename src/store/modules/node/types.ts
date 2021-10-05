import { Modify } from "../../../types/react-app-env";

export interface Node {
  id: string;
  address: string;
  address6: string;
  localaddress: string;
  name: string;
  listenport: number;
  publickey: string;
  endpoint: string;
  postup: string;
  postdown: string;
  allowedips: [
  ],
  persistentkeepalive: number;
  saveconfig: boolean;
  accesskey: string;
  interface: string;
  lastmodified: number;
  keyupdatetimestamp: number;
  expdatetime: number;
  lastpeerupdate: number;
  lastcheckin: number;
  macaddress: string;
  checkininterval: number;
  password: string;
  network: string;
  ispending: string;
  isegressgateway: boolean;
  isingressgateway: boolean;
  egressgatewayranges: [
  ],
  ingressgatewayrange: string;
  isstatic: boolean;
  udpholepunch: boolean;
  pullchanges: boolean;
  dnson: boolean;
  isdualstack: boolean;
  isserver: boolean;
  action: string;
  islocal: boolean;
  localrange: string;
  roaming: boolean;
  ipforwarding: boolean;
  os: string;
  mtu: number;
}

export type NodePayload = Modify<Node, {
  saveconfig: "yes" | "no";
  isegressgateway: "yes" | "no";
  isingressgateway: "yes" | "no";
  isstatic: "yes" | "no";
  udpholepunch: "yes" | "no";
  pullchanges: "yes" | "no";
  dnson: "yes" | "no";
  isdualstack: "yes" | "no";
  isserver: "yes" | "no";
  islocal: "yes" | "no";
  roaming: "yes" | "no";
  ipforwarding: "yes" | "no";
 }>

export interface GetNodes {
  Request: {
    token: string
  },
  Response: Array<NodePayload>
}