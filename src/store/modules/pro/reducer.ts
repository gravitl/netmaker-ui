import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import {
  getUserGroups,
  deleteUserGroup,
  createUserGroup,
} from './actions'

export const reducer = createReducer({
  isProcessing: false as boolean,
  userGroups: [] as string[],
})
.handleAction(getUserGroups['success'], (state, payload) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
    if (!!payload && !!payload.payload) {
      draftState.userGroups = []
      Object.keys(payload.payload).map(group => draftState.userGroups.push(group))
    }
  })
)
.handleAction(getUserGroups['failure'], (state, _) =>
  produce(state, (draftState) => {
    draftState.isProcessing = false
    draftState.userGroups = []
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
    draftState.userGroups = draftState.userGroups.filter(group => group !== payload.payload.groupName)
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
    draftState.userGroups.push(payload.payload.groupName)
  })
)