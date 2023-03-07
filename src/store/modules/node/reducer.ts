import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import { ExternalClient } from '~store/types'
import { shouldSignOut } from '.'
import {
  approveNode,
  clearQr,
  createEgressNode,
  createIngressNode,
  createRelayNode,
  deleteEgressNode,
  deleteExternalClient,
  deleteIngressNode,
  deleteNode,
  deleteRelayNode,
  getExternalClientConf,
  getExternalClients,
  getNodes,
  setNodeSort,
  setShouldLogout,
  updateExternalClient,
  updateNode,
} from './actions'
import { Node, NodeSort } from './types'
import { download } from './utils'

export const reducer = createReducer({
  nodes: [] as Array<Node>,
  isFetching: false as boolean,
  externalClients: [] as Array<ExternalClient>,
  isFetchingClients: false as boolean,
  qrData: '' as string,
  shouldSignOut: '' as shouldSignOut,
  nodeSort: { value: 'network', ascending: true, hostsMap: {} } as NodeSort,
  nodesMap: {} as Record<string, Node>,
})
  .handleAction(setShouldLogout, (state, action) =>
    produce(state, (draftState) => {
      draftState.shouldSignOut = action.payload
    })
  )
  .handleAction(getNodes['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = true
    })
  )
  .handleAction(getExternalClients['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetchingClients = true
    })
  )
  .handleAction(setNodeSort, (state, action) =>
    produce(state, (draftState) => {
      draftState.nodeSort = action.payload
      sortNodes(draftState.nodes, action.payload)
    })
  )
  .handleAction(getNodes['success'], (state, action) =>
    produce(state, (draftState) => {
      if (!!action.payload && action.payload.length) {
        draftState.nodes = action.payload
        sortNodes(draftState.nodes, state.nodeSort)

        // populate nodes map
        draftState.nodes.forEach((node) => {
          draftState.nodesMap[node.id] = node
        })
      } else {
        draftState.nodes = []
      }
      draftState.isFetching = false
    })
  )
  .handleAction(getExternalClients['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.externalClients = action.payload || []
      draftState.isFetchingClients = false
    })
  )
  .handleAction(getNodes['failure'], (state, action) =>
    produce(state, (draftState) => {
      draftState.nodes = []
      draftState.isFetching = false
      if (!!action.payload && !!action.payload.message) {
        // && action.payload.message.includes("unauth")) {
        // if (action.payload.message.includes("Network Error")) {
        //   draftState.shouldSignOut = 'network'
        // }
        if (action.payload.message.includes('status code 401')) {
          draftState.shouldSignOut = 'auth'
        }
      }
    })
  )
  .handleAction(updateNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        const newNode = action.payload
        draftState.nodes[index] = newNode
      }
    })
  )
  .handleAction(deleteNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.nodeid
      )
      if (~index) {
        draftState.nodes = draftState.nodes.filter(
          (node) => node.id !== action.payload.nodeid
        )
      }
    })
  )
  .handleAction(approveNode['success'], (state, action) =>
    produce(state, (draftState) => {
      // const index = draftState.nodes.findIndex(
      //   (node) => node.id === action.payload.nodeid
      // )
      // if (~index) {
      //   draftState.nodes[index].ispending = 'no'
      // }
    })
  )
  .handleAction(createEgressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = action.payload
      }
    })
  )
  .handleAction(deleteEgressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = action.payload
      }
    })
  )
  .handleAction(createIngressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = action.payload
      }
    })
  )
  .handleAction(deleteIngressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = action.payload
        draftState.externalClients = draftState.externalClients.filter(
          (client) =>
            !(
              client.ingressgatewayid === draftState.nodes[index].id &&
              client.network === draftState.nodes[index].network
            )
        )
      }
    })
  )
  .handleAction(createRelayNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = action.payload
      }
    })
  )
  .handleAction(deleteRelayNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = action.payload
      }
    })
  )
  .handleAction(getExternalClients['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.externalClients = []
      draftState.isFetchingClients = false
    })
  )
  .handleAction(getExternalClientConf['success'], (state, action) =>
    produce(state, (draftState) => {
      if (action.payload.type === 'file') {
        download(`${action.payload.filename}.conf`, action.payload.data)
      } else {
        draftState.qrData =
          'data:image/png;base64,' +
          Buffer.from(action.payload.data).toString('base64')
      }
    })
  )
  .handleAction(deleteExternalClient['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.externalClients.findIndex(
        (client) => client.clientid === action.payload.clientid
      )
      if (~index) {
        draftState.externalClients = draftState.externalClients.filter(
          (client) => client.clientid !== action.payload.clientid
        )
      }
    })
  )
  .handleAction(clearQr, (state, _) =>
    produce(state, (draftState) => {
      draftState.qrData = ''
    })
  )
  .handleAction(updateExternalClient['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.externalClients.findIndex(
        (client) => client.clientid === action.payload.previousId
      )
      if (~index) {
        draftState.externalClients[index] = action.payload.client
      }
    })
  )

function sortNodes(nodes: Node[], sortParams: NodeSort): void {
  const { value, ascending, hostsMap } = sortParams

  switch (value) {
    case 'name':
      nodes.sort((a, b) =>
        (hostsMap[a.hostid]?.name ?? '').localeCompare(
          hostsMap[b.hostid]?.name ?? ''
        )
      )
      break
    case 'network':
      // sort by network, then by name
      nodes.sort((a, b) => {
        const aNetwork = a.network
        const bNetwork = b.network
        if (aNetwork === bNetwork) {
          return (hostsMap[a.hostid]?.name ?? '').localeCompare(
            hostsMap[b.hostid]?.name ?? ''
          )
        }
        return aNetwork.localeCompare(bNetwork)
      })
      break
    default:
      nodes.sort((a, b) => a[value].localeCompare(b[value]))
  }
  if (!ascending) {
    nodes.reverse()
  }
}
