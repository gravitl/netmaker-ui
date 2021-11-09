import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import {
  deleteNetwork,
  getNetworks,
  updateNetwork,
  deleteAccessKey,
  createAccessKey,
} from './actions'
import { Network } from './types'
import { networkPayloadToNetwork } from './utils'

export const reducer = createReducer({
  networks: [] as Array<Network>,
  isFetching: false as boolean,
})
  .handleAction(getNetworks['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = true
    })
  )
  .handleAction(getNetworks['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.networks = action.payload.map(networkPayloadToNetwork)
      draftState.isFetching = false
    })
  )
  .handleAction(getNetworks['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.networks = []
      draftState.isFetching = false
    })
  )
  .handleAction(updateNetwork['success'], (state, action) =>
    produce(state, (draftState) => {
      const i = draftState.networks.findIndex(
        (network) => network.netid === action.payload.netid
      )
      if (~i) {
        draftState.networks[i] = {
          ...draftState.networks[i],
          ...networkPayloadToNetwork(action.payload),
        }
      }
    })
  )
  .handleAction(deleteNetwork['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.networks = draftState.networks.filter(
        (network) => network.netid !== action.payload.netid
      )
    })
  )
  .handleAction(deleteAccessKey['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.networks.findIndex(
        (network) => network.netid === action.payload.netid
      )
      if (~index) {
        draftState.networks[index].accesskeys = draftState.networks[
          index
        ].accesskeys.filter(
          (accessKey) => accessKey.name !== action.payload.name
        )
      }
    })
  )
  .handleAction(createAccessKey['success'], (state, action) => 
    produce(state, (draftState) => {
      const index = draftState.networks.findIndex(
        (network) => network.netid === action.payload.netid
      )
      if (~index) {
        draftState.networks[index].accesskeys.push(action.payload.newAccessKey)
      }
    })
  )

