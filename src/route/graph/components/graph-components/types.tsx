// interfaces and types for use in graph-components
export interface DataNode {
    type: DataNodeType
    id: string
    name: string
    lastCheckin: number | undefined
}

export interface AltDataNode {
    id: string
    name: string
    type: 'extclient' | 'cidr' 
}

export interface Edge {
    from: string
    to: string
}

export type DataNodeType = 'normal' | '1&e' | 'ingress' | 'egress' | 'i&r' | 'e&r' | 'relay' | 'relayed' | 'extclient' | 'cidr' | 'i&e&r'
