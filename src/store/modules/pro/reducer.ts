import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import {
  getUserGroups,
  deleteUserGroup,
  createUserGroup,
} from './actions'
import {
  UserGroups
} from './types'

export const reducer = createReducer({
  isProcessing: false as boolean,
  userGroups: new Set<string>() as UserGroups,
})
.handleAction(getUserGroups['success'], (state, payload) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
    if (!!payload) {
      draftState.userGroups = payload.payload
      console.log("RECEIVED:", payload.payload)
    }
  })
)
.handleAction(getUserGroups['failure'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
    draftState.userGroups = new Set<string>()
  })
)
.handleAction(getUserGroups['request'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = true
  })
)
.handleAction(deleteUserGroup['request'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = true
  })
)
.handleAction(deleteUserGroup['failure'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
  })
)
.handleAction(deleteUserGroup['success'], (state, payload) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
    draftState.userGroups?.delete(payload.payload.groupName)
  })
)
.handleAction(createUserGroup['request'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = true
  })
)
.handleAction(createUserGroup['failure'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
  })
)
.handleAction(createUserGroup['success'], (state, payload) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
    draftState.userGroups?.add(payload.payload.groupName)
  })
)