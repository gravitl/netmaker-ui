import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getServer = (state: RootState) => state.server
export const getServerConfig = createSelector(
  getServer,
  (server) => server.config
)
export const isFetchingServerConfig = createSelector(
  getServer,
  (server) => server.isFetching
)
export const getServerLogs = createSelector(getServer, (server) => server.logs)
export const getMetrics = createSelector(getServer, (server) => server.metrics)
export const getNodeMetrics = createSelector(
  getServer,
  (server) => server.nodeMetrics
)
export const getAttempts = createSelector(
  getServer,
  (server) => server.attempts
)
export const hasFetchedNodeMetrics = createSelector(
  getServer,
  (server) => server.fetchedNodeMetrics
)

export const getNetworkExtMetrics = (network: string) =>
  createSelector(getServer, (server) => server.extMetrics[network])

export const getAllMetrics = (network: string) =>
  createSelector(getServer, (server) => server.allMetrics[network])

export const isFetchingClientMetrics = createSelector(
  getServer,
  (server) => server.fetchingExtMetrics
)
