import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { RootState } from 'typesafe-actions'
import { ExternalClient, Node } from '~modules/node'
import { nodeSelectors } from '~store/selectors'
import { DNS } from '~store/types'

const nodeByIdPredicate = (id: Node['id']) => (node: Node) => node.id === id

const nodeByNamePredicate = (name: Node['name']) => (node: Node) =>
  node.name === name

const makeSelectNodeByID = () =>
  createSelector(
    nodeSelectors.getNodes,
    (_: RootState, id: Node['id']) => id,
    (nodes, id) => nodes.find(nodeByIdPredicate(id))
  )

export const useNodeById = (id: Node['id']) => {
  const selectNode = useMemo(makeSelectNodeByID, [])
  return useSelector<RootState, Node | undefined>((state) =>
    selectNode(state, id)
  )
}

const makeSelectNode = () =>
  createSelector(
    nodeSelectors.getNodes,
    (_: RootState, name: Node['name']) => name,
    (nodes, name) => nodes.find(nodeByNamePredicate(name))
  )

export const useNode = (name: Node['name']) => {
  const selectNode = useMemo(makeSelectNode, [])
  return useSelector<RootState, Node | undefined>((state) =>
    selectNode(state, name)
  )
}

export const filterIngressGateways = (nodes: Node[]) => {
  return nodes.filter((node) => node.ingressgatewayrange)
}

export const filterExtClientsByNetwork = (
  clients: ExternalClient[],
  netid: string
) => {
  return clients.filter((client) => client.network === netid)
}

export const filterCustomDNSByNetwork = (
  nodes: Node[],
  dnsEntries: DNS[],
  netid: string
) => {
  const networkDnsEntries = dnsEntries.filter(
    (entry) => entry.network === netid
  )
  // get rid of all node named entries
  return networkDnsEntries.filter(
    (entry) => !nodes.find((node) => node.name === entry.name)
  )
}
