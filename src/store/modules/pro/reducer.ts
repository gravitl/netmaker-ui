import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import {
  getUserGroups,
  deleteUserGroup,
  createUserGroup,
  getNetworkUsers,
  deleteNetworkUser,
  updateNetworkUser,
  getNetworkUserData,
} from './actions'
import { NetworksUsersMap, NetworkUserDataMap } from './types'

export const reducer = createReducer({
  isProcessing: false as boolean,
  userGroups: [] as string[],
  networkUsers: {} as NetworksUsersMap,
  networkUserData: {} as NetworkUserDataMap,
})
.handleAction(getNetworkUserData['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      if (!!payload && !!payload.payload) {
        draftState.networkUserData = payload.payload
      }
      console.log("USER DATA:", JSON.stringify(draftState.networkUserData))
    })
  )
  .handleAction(getNetworkUserData['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      draftState.networkUserData = {}
    })
  )
  .handleAction(getNetworkUserData['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(getUserGroups['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      if (!!payload && !!payload.payload) {
        draftState.userGroups = []
        Object.keys(payload.payload).map((group) =>
          draftState.userGroups.push(group)
        )
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
      draftState.userGroups = draftState.userGroups.filter(
        (group) => group !== payload.payload.groupName
      )
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
  .handleAction(getNetworkUsers['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(getNetworkUsers['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      draftState.networkUsers = payload.payload
    })
  )
  .handleAction(getNetworkUsers['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )
  .handleAction(deleteNetworkUser['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(deleteNetworkUser['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      const { networkName, networkUserID } = payload.payload
      draftState.networkUsers[networkName] = draftState.networkUsers[
        networkName
      ].filter((user) => user.id !== networkUserID)
    })
  )
  .handleAction(deleteNetworkUser['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )
  .handleAction(updateNetworkUser['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(updateNetworkUser['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      // get the users of the network then update the user from the users
      const { networkName, networkUser } = payload.payload
      const users = draftState.networkUsers[networkName]
      const userIndex = users.findIndex((user) => user.id === networkUser.id)
      if (~userIndex) {
        // if the user exists, update it
        users[userIndex] = networkUser
      }
      draftState.networkUsers[networkName] = users
    })
  )
  .handleAction(updateNetworkUser['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )
