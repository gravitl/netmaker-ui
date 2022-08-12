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
import { download, nodePayloadToNode } from './utils'

export const reducer = createReducer({
  nodes: [] as Array<Node>,
  isFetching: false as boolean,
  externalClients: [] as Array<ExternalClient>,
  isFetchingClients: false as boolean,
  qrData: '' as string,
  shouldSignOut: '' as shouldSignOut,
  nodeSort: { value: 'name', ascending: true } as NodeSort,
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
      const { value, ascending } = action.payload
      draftState.nodes = draftState.nodes.sort((a, b) =>
        a[value].localeCompare(b[value])
      )
      if (!ascending) {
        draftState.nodes = draftState.nodes.reverse()
      }
    })
  )
  .handleAction(getNodes['success'], (state, action) =>
    produce(state, (draftState) => {
      if (!!action.payload && action.payload.length) {
        draftState.nodes = action.payload.map(nodePayloadToNode)
        const { value, ascending } = state.nodeSort
        draftState.nodes = draftState.nodes.sort((a, b) =>
          a[value].localeCompare(b[value])
        )
        if (!ascending) {
          draftState.nodes = draftState.nodes.reverse()
        }
      } else {
        draftState.nodes = []
      }
      console.log(JSON.stringify(draftState.nodes))

      draftState.isFetching = false
    })
  )
  .handleAction(getExternalClients['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.externalClients = action.payload || []
      draftState.isFetchingClients = false
      console.log(
        'externalclients:',
        JSON.stringify(draftState.externalClients)
      )
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
        const newNode = nodePayloadToNode(action.payload)
        if (newNode.ishub && draftState.nodes[index].ishub !== newNode.ishub) {
          // set all other nodes on same network as not hub
          for (let i = 0; i < draftState.nodes.length; i++) {
            if (
              i !== index &&
              draftState.nodes[i].network === newNode.network
            ) {
              draftState.nodes[i].ishub = false
            }
          }
        }
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
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.nodeid
      )
      if (~index) {
        draftState.nodes[index].ispending = 'no'
      }
    })
  )
  .handleAction(createEgressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(deleteEgressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(createIngressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(deleteIngressNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
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
        draftState.nodes[index] = nodePayloadToNode(action.payload)
      }
    })
  )
  .handleAction(deleteRelayNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
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
