import { createAction, createAsyncAction } from 'typesafe-actions'
import {
  CreateAdmin,
  CreateUser,
  DeleteUser,
  GetAllUsers,
  GetUser,
  HasAdmin,
  Login,
  UpdateUser,
  UpdateUserNetworks,
  User,
} from './types'

export const setUser = createAction('setUser')<User>()

export const logout = createAction('logout')<void>()

export const getAllUsers = createAsyncAction(
  'api_getAllUsers_Request',
  'api_getAllUsers_Success',
  'api_getAllUsers_Failure'
)<GetAllUsers['Request'], GetAllUsers['Response'], Error>()

export const getUser = createAsyncAction(
  'api_getUser_Request',
  'api_getUser_Success',
  'api_getUser_Failure'
)<GetUser['Request'], GetUser['Response'], Error>()

export const login = createAsyncAction(
  'api_login_Request',
  'api_login_Success',
  'api_login_Failure'
)<Login['Request'], Login['Response'], Error>()

export const hasAdmin = createAsyncAction(
  'api_hasAdmin_Request',
  'api_hasAdmin_Success',
  'api_hasAdmin_Failure'
)<HasAdmin['Request'], HasAdmin['Response'], Error>()

export const createAdmin = createAsyncAction(
  'api_createAdmin_Request',
  'api_createAdmin_Success',
  'api_createAdmin_Failure'
)<CreateAdmin['Request'], CreateAdmin['Response'], Error>()

export const createUser = createAsyncAction(
  'api_createUser_Request',
  'api_createUser_Success',
  'api_createUser_Failure'
)<CreateUser['Request'], CreateUser['Response'], Error>()

export const deleteUser = createAsyncAction(
  'api_deleteUser_Request',
  'api_deleteUser_Success',
  'api_deleteUser_Failure'
)<DeleteUser['Request'], DeleteUser['Response'], Error>()

export const updateUser = createAsyncAction(
  'api_updateUser_Request',
  'api_updateUser_Success',
  'api_updateUser_Failure'
)<UpdateUser['Request'], UpdateUser['Response'], Error>()

export const updateUserNetworks = createAsyncAction(
  'api_updateUserNetworks_Request',
  'api_updateUserNetworks_Success',
  'api_updateUserNetworks_Failure'
)<UpdateUserNetworks['Request'], UpdateUserNetworks['Response'], Error>()
