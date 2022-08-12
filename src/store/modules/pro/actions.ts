import { createAsyncAction } from 'typesafe-actions'
import { UserGroupsPayload, UserGroupDelorCreate } from '.'
import {
  NetworkUsersPayload,
  NetworkUserDelPayload,
  NetworkUserUpdatePayload,
  NetworkUserGetPayload,
} from '.'

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

export const getNetworkUsers = createAsyncAction(
  'Pro_getNetworkUsers_Request',
  'Pro_getNetworkUsers_Success',
  'Pro_getNetworkUsers_Failure'
)<NetworkUsersPayload['Request'], NetworkUsersPayload['Response'], Error>()

export const deleteNetworkUser = createAsyncAction(
  'Pro_deleteNetworkUser_Request',
  'Pro_deleteNetworkUser_Success',
  'Pro_deleteNetworkUser_Failure'
)<NetworkUserDelPayload['Request'], NetworkUserDelPayload['Response'], Error>()

export const updateNetworkUser = createAsyncAction(
  'Pro_updateNetworkUser_Request',
  'Pro_updateNetworkUser_Success',
  'Pro_updateNetworkUser_Failure'
)<
  NetworkUserUpdatePayload['Request'],
  NetworkUserUpdatePayload['Response'],
  Error
>()

export const getNetworkUserData = createAsyncAction(
  'Pro_getNetworkUserData_Request',
  'Pro_getNetworkUserData_Success',
  'Pro_getNetworkUserData_Failure'
)<
  NetworkUserGetPayload['Request'],
  NetworkUserGetPayload['Response'],
  Error
>()
