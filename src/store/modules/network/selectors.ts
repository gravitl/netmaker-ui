import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getNetwork = (state: RootState) => state.network
export const isFetchingNetworks = createSelector(
  getNetwork,
  (network) => network.isFetching
)
export const getNetworks = createSelector(
  getNetwork,
  (network) => network.networks
)

export const getDnsEntries = createSelector(
  getNetwork,
  network => network.dnsEntries
)
