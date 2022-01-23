// interfaces and types for use in graph-components
export interface DataNode {
    type: DataNodeType,
    id: string,
    name: string
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

export type DataNodeType = 'normal' | '1&e' | 'ingress' | 'egress' | 'relay' | 'relayed' | 'extclient' | 'cidr' | 'i&e&r'
