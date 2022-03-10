import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getACLState = (state: RootState) => state.acls

export const isProcessing = createSelector(
  getACLState,
  (acl) => acl.isProcessing
)
export const getCurrentACL = createSelector(getACLState, (acl) => acl.currentACL)
