import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import {
  updateNodeACL,
  updateNodeContainerACL,
  getNodeACLContainer,
  clearCurrentACL,
} from './actions'
import {
  NodeACLContainer
} from './types'

export const reducer = createReducer({
  isProcessing: false as boolean,
  currentACL: {} as NodeACLContainer,
})
.handleAction(clearCurrentACL, (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
    draftState.currentACL = {}
  })
)
.handleAction(getNodeACLContainer['request'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = true
  })
)
.handleAction(getNodeACLContainer['success'], (state, payload) =>
  produce(state, (draftState) => {
    console.log("PAYLOAD", payload)
    draftState.isProcessing = false
    draftState.currentACL = payload.payload
  })
)
.handleAction(getNodeACLContainer['failure'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
  })
)
.handleAction(updateNodeContainerACL['request'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = true
  })
)
.handleAction(updateNodeContainerACL['success'], (state, payload) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
    draftState.currentACL = payload.payload
  })
)
.handleAction(updateNodeContainerACL['failure'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
  })
)
.handleAction(updateNodeACL['request'], (state, _) => 
  produce(state, (draftState) => {
    draftState.isProcessing = true
  })
)
.handleAction(updateNodeACL['success'], (state, payload) => 
  produce(state, (draftState) => {
    draftState.isProcessing = false
    const { nodeID, nodeACL } = payload.payload
    draftState.currentACL[nodeID] = nodeACL
  })
)
.handleAction(updateNodeACL['failure'], (state, _) => 
  produce(state, (draftState) => {
    draftState.isProcessing = false
  })
)
