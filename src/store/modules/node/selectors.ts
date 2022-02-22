import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getNodeState = (state: RootState) => state.node

export const isFetchingNodes = createSelector(
  getNodeState,
  (node) => node.isFetching
)
export const getNodes = createSelector(getNodeState, (node) => node.nodes)

export const getExtClients = createSelector(
  getNodeState,
  (node) => node.externalClients
)

export const getCurrentQrCode = createSelector(
  getNodeState,
  (node) => node.qrData
)

export const getShouldSignOut = createSelector(
  getNodeState,
  (node) => node.shouldSignOut
)
