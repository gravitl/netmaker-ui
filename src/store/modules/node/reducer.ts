import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import { createEgressNode, createIngressNode, createRelayNode, deleteEgressNode, deleteIngressNode, deleteNode, deleteRelayNode, getNodes, updateNode } from './actions'
import { Node } from './types'
import { nodePayloadToNode } from './utils'

export const reducer = createReducer({
  nodes: [] as Array<Node>,
  isFetching: false as boolean,
})
  .handleAction(getNodes['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = true
    })
  )
  .handleAction(getNodes['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.nodes = action.payload.map(nodePayloadToNode)
      draftState.isFetching = false
    })
  )
  .handleAction(getNodes['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.nodes = []
      draftState.isFetching = false
    })
  )
  .handleAction(updateNode['success'], (state, action) => 
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        node => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(deleteNode['success'], (state, action) => 
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        node => node.id === action.payload.nodeid
      )
      if (~index) {
        draftState.nodes = draftState.nodes.filter(node => node.id !== action.payload.nodeid)
      }
    })
  )
  .handleAction(createEgressNode['success'], (state, action) => 
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        node => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(deleteEgressNode['success'], (state, action) => 
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        node => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(createIngressNode['success'], (state, action) => 
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        node => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(deleteIngressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        node => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(createRelayNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        node => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(deleteRelayNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        node => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  
