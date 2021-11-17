import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import { ExternalClient } from '~store/types'
import {
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
  updateExternalClient,
  updateNode,
} from './actions'
import { Node } from './types'
import { download, nodePayloadToNode } from './utils'

export const reducer = createReducer({
  nodes: [] as Array<Node>,
  isFetching: false as boolean,
  externalClients: [] as Array<ExternalClient>,
  isFetchingClients: false as boolean,
  qrData: '' as string,
})
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
  .handleAction(getNodes['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.nodes = action.payload.map(nodePayloadToNode)
      draftState.nodes = draftState.nodes.sort((a, b) => a.name.localeCompare(b.name))
      draftState.isFetching = false
    })
  )
  .handleAction(getExternalClients['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.externalClients = action.payload || []
      draftState.isFetchingClients = false
    })
  )
  .handleAction(getNodes['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.nodes = []
      draftState.isFetching = false
    })
  )
  .handleAction(updateNode['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.nodes.findIndex(
        (node) => node.id === action.payload.id
      )
      if (~index) {
        draftState.nodes[index] = nodePayloadToNode(action.payload)
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
        draftState.externalClients = draftState.externalClients.filter(client =>  
          !(client.ingressgatewayid === draftState.nodes[index].macaddress && 
            client.network === draftState.nodes[index].network)
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
