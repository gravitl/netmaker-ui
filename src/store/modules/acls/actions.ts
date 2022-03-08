import { createAction, createAsyncAction } from 'typesafe-actions'
import { GetACLContainerPayload, UpdateNodeACLContainerPayload, UpdateNodeACLPayload } from '.'

export const getNodeACLContainer = createAsyncAction(
  'ACLs_getNodeACLContainer_Request',
  'ACLs_getNodeACLContainer_Success',
  'ACLs_getNodeACLContainer_Failure'
)<GetACLContainerPayload['Request'], GetACLContainerPayload['Response'], Error>()

export const updateNodeContainerACL = createAsyncAction(
  'ACLs_updateNodeACLContainer_Request',
  'ACLs_updateNodeACLContainer_Success',
  'ACLs_updateNodeACLContainer_Failure'
)<UpdateNodeACLContainerPayload['Request'], UpdateNodeACLContainerPayload['Response'], Error>()

export const updateNodeACL = createAsyncAction(
  'ACLs_updateNodeACL_Request',
  'ACLs_updateNodeACL_Success',
  'ACLs_updateNodeACL_Failure'
)<UpdateNodeACLPayload['Request'], UpdateNodeACLPayload['Response'], Error>()

export const clearCurrentACL = createAction('clearCurrentACLContainer')<string>()
