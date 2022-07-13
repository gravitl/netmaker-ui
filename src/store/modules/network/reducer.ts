import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import { DNS } from '~store/types'
import {
  deleteNetwork,
  getNetworks,
  updateNetwork,
  deleteAccessKey,
  createAccessKey,
  clearTempKey,
  refreshPublicKeys,
  getDnsEntries,
  createDnsEntry,
  deleteDnsEntry,
  setTempKey,
  createNetwork,
} from './actions'
import { Network } from './types'
import { networkPayloadToNetwork } from './utils'

export const reducer = createReducer({
  networks: [] as Array<Network>,
  isFetching: false as boolean,
  dnsEntries: [] as Array<DNS>,
  tempkey: {
    accessString: '',
    value: '',
  },
})
  .handleAction(getNetworks['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = true
    })
  )
  .handleAction(getNetworks['success'], (state, action) =>
    produce(state, (draftState) => {
      if (!!action.payload && action.payload.length) {
        draftState.networks = action.payload.map(networkPayloadToNetwork)
        draftState.networks = draftState.networks.sort((a, b) => a.netid.localeCompare(b.netid))
        console.log(draftState.networks[0])
      } else {
        draftState.networks = []
      }
      for (let i = 0; i < draftState.networks.length; i++) {
        if (!!!draftState.networks[i].accesskeys) {
          draftState.networks[i].accesskeys = []
        }
      }
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
  .handleAction(createNetwork['success'], (state, action) =>
    produce(state, (draftState) => {
      if (!!action.payload) {
        draftState.networks.push(networkPayloadToNetwork(action.payload))    
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
        draftState.tempkey = {
          accessString: action.payload.newAccessKey.accessstring,
          value: action.payload.newAccessKey.value,
        }
      }
    })
  )
  .handleAction(clearTempKey, (state, _) =>
    produce(state, (draftState) => {
      draftState.tempkey.accessString = ''
      draftState.tempkey.value = ''
    })
  )
  .handleAction(setTempKey, (state, action) =>
    produce(state, (draftState) => {
      draftState.tempkey = { ...action.payload }
    })
  )
  .handleAction(refreshPublicKeys['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.networks.findIndex(
        (network) => network.netid === action.payload.netid
      )
      if (~index) {
        draftState.networks[index] = {
          ...draftState.networks[index],
          ...networkPayloadToNetwork(action.payload),
        }
      }
    })
  )
  .handleAction(getDnsEntries['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.dnsEntries = !!action.payload ? action.payload : []
    })
  )
  .handleAction(createDnsEntry['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.dnsEntries.push(action.payload)
    })
  )
  .handleAction(deleteDnsEntry['success'], (state, action) =>
    produce(state, (draftState) => {
      const index = draftState.dnsEntries.findIndex(
        (entry) => entry.name === action.payload.domain
      )
      if (~index) {
        draftState.dnsEntries = draftState.dnsEntries.filter(
          (entry) => entry.name !== action.payload.domain
        )
      }
    })
  )
