import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { RootState } from 'typesafe-actions'
import { Host } from '~store/modules/hosts'
import { hostsSelectors } from '~store/selectors'

const hostByIdPredicate = (id: Host['id']) => (host: Host) => host.id === id

const makeSelectHostByID = () =>
  createSelector(
    hostsSelectors.getHosts,
    (_: RootState, id: Host['id']) => id,
    (hosts, id) => hosts.find(hostByIdPredicate(id))
  )

export const useGetHostById = (id: Host['id']) => {
  const selectHost = useMemo(makeSelectHostByID, [])
  return useSelector<RootState, Host | undefined>((state) =>
    selectHost(state, id)
  )
}
