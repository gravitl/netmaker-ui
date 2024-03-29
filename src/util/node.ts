import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { RootState } from 'typesafe-actions'
import { ExternalClient, Node, NodeConnectivityStatus } from '~modules/node'
import { getHosts, getHostsMap } from '~store/modules/hosts/selectors'
import { nodeSelectors } from '~store/selectors'
import { DNS, Host } from '~store/types'

const nodeByIdPredicate = (id: Node['id']) => (node: Node) => node.id === id

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

export const filterIngressGateways = (nodes: Node[]) => {
  return nodes.filter((node) => node.isingressgateway)
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
  netid: string,
  hostsMap: ReturnType<typeof getHostsMap>
) => {
  const networkDnsEntries = dnsEntries.filter(
    (entry) => entry.network === netid
  )
  // get rid of all node named entries
  return networkDnsEntries.filter(
    (entry) => !nodes.find((node) => hostsMap[node.hostid]?.name === entry.name)
  )
}

/**
 * Calculates node connectivity using last check-in time.
 *
 * @param {Node} node the node whose connectivity is to be checked
 */
export const getNodeConnectivityStatus = (
  node: Node | ExternalClient
): NodeConnectivityStatus => {
  return getConnectivityStatus((node as Node).lastcheckin)
}

/**
 * Calculates node connectivity using last check-in time.
 *
 * @param {number} lastCheckInTime node's last check-in time
 */
export const getConnectivityStatus = (
  lastCheckInTime: number
): NodeConnectivityStatus => {
  const ERROR_THRESHOLD = 1800
  const WARNING_THRESHOLD = 300

  const currentTime = Date.now() / 1000

  if (lastCheckInTime === undefined || lastCheckInTime === null) return 'unknown'
  else if (currentTime - lastCheckInTime >= ERROR_THRESHOLD) return 'error'
  else if (currentTime - lastCheckInTime >= WARNING_THRESHOLD) return 'warning'
  else return 'healthy'
}

/**
 * Determines the status of an edge between two nodes.
 * 
 * @description
 * "Order of priority" error -> unkown -> warning -> healthy
 *
 * @param node1 first node
 * @param node2 second node
 * @returns status of the edge between the given nodes
 */
export const getEdgeConnectivity = (
  node1: Node | ExternalClient,
  node2: Node | ExternalClient
): NodeConnectivityStatus => {
  const nodeStatuses = [
    getNodeConnectivityStatus(node1),
    getNodeConnectivityStatus(node2),
  ]
  let edgeStatus: any = null // using any to prevent disruption from TS2307

  for (let i = 0; i < nodeStatuses.length; i++) {
    const status = nodeStatuses[i]

    if (status === 'error') {
      edgeStatus = 'error'
      break
    } else if (status === 'unknown' && edgeStatus !== 'error') {
      edgeStatus = 'unknown'
    } else if (
      status === 'warning' &&
      edgeStatus !== 'error' &&
      edgeStatus !== 'unknown'
    ) {
      edgeStatus = 'warning'
    } else if (
      status === 'healthy' &&
      edgeStatus !== 'warning' &&
      edgeStatus !== 'unknown' &&
      edgeStatus !== 'error'
    ) {
      edgeStatus = 'healthy'
    }
  }

  if (edgeStatus === null) edgeStatus = 'unknown'

  return edgeStatus as NodeConnectivityStatus
}

/**
 * Returns the associated host for a node otherwise undefined
 * 
 * @param node node
 */
export const useGetAssociatedHost = (node: Node): Host | undefined => {
  const hosts = useSelector(getHosts)
  return hosts.find(host => host.id === node.hostid)
}

/**
 * Derives the node name from the associated host
 * 
 * @param node node
 */
export const useDeriveNodeName = (node: Node): string => {
  return useGetAssociatedHost(node)?.name ?? ''
}
