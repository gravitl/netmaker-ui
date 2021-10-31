import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import { getNodes } from './actions'
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
