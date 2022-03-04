export type NodeID = string

export type NodeACL = Record<NodeID, number>

export type NodeACLContainer = Record<NodeID, NodeACL> 

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
      token: string
      netid: string
    }
    Response: NodeACLContainer
}
