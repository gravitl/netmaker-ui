import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getProState = (state: RootState) => state.pro

export const isProcessing = createSelector(
  getProState,
  (pro) => pro.isProcessing
)

export const userGroups = createSelector(getProState, (pro) => pro.userGroups)

export const networkUsers = createSelector(
  getProState,
  (pro) => pro.networkUsers
)

export const networkUserData = createSelector(
  getProState,
  (pro) => pro.networkUserData
)

export const getNetworkUserNetworks = createSelector(getProState, (pro) =>
  Object.keys(pro.networkUserData)
)

export const getCurrentAccessKey = createSelector(getProState, (pro) => pro.currentAccessKey)

export const isCreatingGroup = createSelector(getProState, (pro) => pro.isCreatingGroup)
