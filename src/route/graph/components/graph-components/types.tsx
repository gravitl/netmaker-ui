import { NodeConnectivityStatus } from "~store/types"

// interfaces and types for use in graph-components
export interface DataNode {
    type: DataNodeType
    id: string
    name: string
    lastCheckin: number | undefined
    address?: string
    address6?: string
}

export interface AltDataNode {
    id: string
    name: string
    type: 'extclient' | 'cidr' 
    address?: string
    address6?: string
}

export interface Edge {
    from: string
    to: string
    status: NodeConnectivityStatus
}

export type DataNodeType = 'normal' | '1&e' | 'ingress' | 'egress' | 'i&r' | 'e&r' | 'relay' | 'relayed' | 'extclient' | 'cidr' | 'i&e&r'
