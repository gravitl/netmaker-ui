import { createAsyncAction } from 'typesafe-actions'
import { UserGroupsPayload, UserGroupDelorCreate, } from '.'

export const getUserGroups = createAsyncAction(
  'Pro_getUserGroups',
  'Pro_getUserGroups_Success',
  'Pro_getUserGroups_Failure'
)<UserGroupsPayload['Request'], UserGroupsPayload['Response'], Error>()

export const createUserGroup = createAsyncAction(
  'Pro_createUserGroup_Request',
  'Pro_createUserGroup_Success',
  'Pro_createUserGroup_Failure'
)<UserGroupDelorCreate['Request'], UserGroupDelorCreate['Response'], Error>()

export const deleteUserGroup = createAsyncAction(
  'Pro_deleteUserGroup_Request',
  'Pro_deleteUserGroup_Success',
  'Pro_deleteUserGroup_Failure'
)<UserGroupDelorCreate['Request'], UserGroupDelorCreate['Response'], Error>()
