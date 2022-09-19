export type NodeID = string

export type NodeACL = Record<NodeID, number>

export type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };

export type NodeACLContainer =  MutableRequired<{ [nodeID: NodeID] : NodeACL}>

export interface UpdateNodeACLPayload {
    Request: {
      netid: string
      nodeid: NodeID
      nodeACL: NodeACL
    }
    Response: {
        nodeID: NodeID
        nodeACL: NodeACL
    }
}

export interface UpdateNodeACLContainerPayload {
    Request: {
        netid: string
        aclContainer: NodeACLContainer
    }
    Response: NodeACLContainer
}

export interface GetACLContainerPayload {
    Request: {
      netid: string
    }
    Response: NodeACLContainer
}
