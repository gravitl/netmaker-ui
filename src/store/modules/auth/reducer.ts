import { produce } from 'immer'
import * as ls from 'local-storage'
import { createReducer } from 'typesafe-actions'
import { USER_KEY } from '../../../config'
import { createAdmin, hasAdmin, login, logout, setUser } from './actions'
import { LocalStorageUserKeyValue } from './types'

const initialValues = ls.get<LocalStorageUserKeyValue | undefined>(USER_KEY)

export const reducer = createReducer({
  token: initialValues?.token,
  user: initialValues?.user,
  isLoggingIn: false,
  hasAdmin: false,
  isCreating: false,
})
  .handleAction(setUser, (state, action) =>
    produce(state, (draftState) => {
      draftState.user = action.payload
    })
  )
  .handleAction(login['request'], (state, action) =>
    produce(state, (draftState) => {
      draftState.isLoggingIn = true
    })
  )
  .handleAction(login['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.user = action.payload.user
      draftState.token = action.payload.token
      draftState.isLoggingIn = false

      ls.set<LocalStorageUserKeyValue>(USER_KEY, {
        token: action.payload.token,
        user: action.payload.user,
      })
    })
  )
  .handleAction(login['failure'], (state, action) =>
    produce(state, (draftState) => {
      draftState.user = undefined
      draftState.token = undefined
      draftState.isLoggingIn = false

      ls.set<void>(USER_KEY, undefined)
    })
  )
  .handleAction(logout, (state, _) =>
    produce(state, (draftState) => {
      draftState.user = undefined
      draftState.token = undefined

      ls.set<void>(USER_KEY, undefined)
    })
  )
  .handleAction(hasAdmin['success'], (state, result) =>
    produce(state, (draftState) => {
      draftState.hasAdmin = result.payload
    })
  )
  .handleAction(hasAdmin['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.hasAdmin = false
    })
  )
  .handleAction(createAdmin['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isCreating = true
    })
  )
  .handleAction(createAdmin['success'], (state, _) =>
    produce(state, (draftState) => {
      draftState.hasAdmin = true
      draftState.isCreating = false
    })
  )
  .handleAction(createAdmin['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isCreating = false
    })
  )
