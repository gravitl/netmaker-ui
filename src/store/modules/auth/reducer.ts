import { produce } from 'immer'
import jwtDecode from 'jwt-decode'
import * as ls from 'local-storage'
import { createReducer } from 'typesafe-actions'
import { USER_KEY } from '../../../config'
import {
  createAdmin,
  createUser,
  deleteUser,
  getAllUsers,
  hasAdmin,
  login,
  logout,
  setUser,
} from './actions'
import { LocalStorageUserKeyValue, User } from './types'

const initialValues = ls.get<LocalStorageUserKeyValue | undefined>(USER_KEY)

export const reducer = createReducer({
  token: initialValues?.token,
  user: initialValues?.user,
  isLoggingIn: false,
  hasAdmin: false,
  isCreating: false,
  users: [] as User[],
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
      draftState.token = action.payload.token
      draftState.isLoggingIn = false
      const decoded: {
        IsAdmin: boolean
        UserName: string
        Networks: Array<string>
        exp: number
      } = jwtDecode(action.payload.token)
      draftState.user = {
        isAdmin: decoded.IsAdmin,
        name: decoded.UserName,
        networks: decoded.Networks,
        exp: decoded.exp,
      }
      ls.set<LocalStorageUserKeyValue>(USER_KEY, {
        token: action.payload.token,
        user: draftState.user,
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
  .handleAction(getAllUsers['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.users = action.payload.map((user: any) => ({
        isAdmin: user.isadmin,
        name: user.username,
        networks: user.networks,
        exp: 0,
      }))
    })
  )
  .handleAction(createUser['success'], (state, { payload }) =>
    produce(state, (draftState) => {
      draftState.users.push({
        isAdmin: payload.isadmin,
        name: payload.username,
        exp: 0,
        networks: payload.networks,
      })
    })
  )
  .handleAction(deleteUser['success'], (state, { payload }) =>
    produce(state, (draftState) => {
      draftState.users = draftState.users.filter(
        (user) => user.name !== payload.username
      )
    })
  )
