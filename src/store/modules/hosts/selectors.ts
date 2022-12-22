import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getHostsState = (state: RootState) => state.hosts

export const isProcessingHosts = createSelector(
  getHostsState,
  (hostsState) => hostsState.isProcessing
)

export const getHosts = createSelector(
  getHostsState,
  (hostsState) => hostsState.hosts
)
