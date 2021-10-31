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
