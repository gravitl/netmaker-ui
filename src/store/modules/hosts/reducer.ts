import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import { clearHosts, getHosts, updateHost, deleteHost } from './actions'
import { Host } from '.'

export const reducer = createReducer({
  isProcessing: false,
  hosts: [] as Host[],
})
  // reset store actions
  .handleAction(clearHosts, (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      draftState.hosts = []
    })
  )

  // get hosts actions
  .handleAction(getHosts['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(getHosts['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      draftState.hosts = payload.payload
    })
  )
  .handleAction(getHosts['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )

  // update host actions
  .handleAction(updateHost['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(updateHost['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      const newState: Host[] = JSON.parse(JSON.stringify(state.hosts))
      const updatedHostId = payload.payload.id
      newState.splice(
        newState.findIndex((host: Host) => host.id === updatedHostId),
        1,
        payload.payload
      )
      draftState.hosts = newState
    })
  )
  .handleAction(updateHost['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )

  // delete host actions
  .handleAction(deleteHost['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(deleteHost['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false

      const newState: Host[] = JSON.parse(JSON.stringify(state.hosts))
      const deletedHostId = payload.payload.id
      newState.splice(
        newState.findIndex((host: Host) => host.id === deletedHostId),
        1
      )
      draftState.hosts = newState
    })
  )
  .handleAction(deleteHost['failure'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )
