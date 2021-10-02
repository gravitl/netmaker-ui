import { AxiosResponse } from "axios";
import { createAsyncAction } from "typesafe-actions";
import {
  GetPayload,
  GetAllUsers,
  GetUser,
  Login,
  GetServerConfig,
  GetNetworks,
  GetNodes,
  HasAdmin,
  CreateAdmin,
  CreateUser,
  DeleteUser,
  UpdateUser
} from "./types";

export const get = createAsyncAction(
  "api_get_Request",
  "api_get_Success",
  "api_get_Failure"
)<GetPayload, AxiosResponse<any>, Error>();

export const getAllUsers = createAsyncAction(
  "api_getAllUsers_Request",
  "api_getAllUsers_Success",
  "api_getAllUsers_Failure"
)<GetAllUsers["Request"], GetAllUsers["Response"], Error>();

export const getUser = createAsyncAction(
  "api_getUser_Request",
  "api_getUser_Success",
  "api_getUser_Failure"
)<GetUser["Request"], GetUser["Response"], Error>();

export const login = createAsyncAction(
  "api_login_Request",
  "api_login_Success",
  "api_login_Failure"
)<Login["Request"], Login["Response"], Error>();

export const getServerConfig = createAsyncAction(
  "api_getServerConfig_Request",
  "api_getServerConfig_Success",
  "api_getServerConfig_Failure"
)<GetServerConfig["Request"], GetServerConfig["Response"], Error>();

export const getNetworks = createAsyncAction(
  "api_getNetworks_Request",
  "api_getNetworks_Success",
  "api_getNetworks_Failure"
)<GetNetworks["Request"], GetNetworks["Response"], Error>();

export const getNodes = createAsyncAction(
  "api_getNodes_Request",
  "api_getNodes_Success",
  "api_getNodes_Failure"
)<GetNodes["Request"], GetNodes["Response"], Error>();

export const hasAdmin = createAsyncAction(
  "api_hasAdmin_Request",
  "api_hasAdmin_Success",
  "api_hasAdmin_Failure"
)<HasAdmin["Request"], HasAdmin["Response"], Error>();

export const createAdmin = createAsyncAction(
  "api_createAdmin_Request",
  "api_createAdmin_Success",
  "api_createAdmin_Failure"
)<CreateAdmin["Request"], CreateAdmin["Response"], Error>();

export const createUser = createAsyncAction(
  "api_createUser_Request",
  "api_createUser_Success",
  "api_createUser_Failure"
)<CreateUser["Request"], CreateUser["Response"], Error>();

export const deleteUser = createAsyncAction(
  "api_deleteUser_Request",
  "api_deleteUser_Success",
  "api_deleteUser_Failure"
)<DeleteUser["Request"], DeleteUser["Response"], Error>();

export const updateUser = createAsyncAction(
  "api_updateUser_Request",
  "api_updateUser_Success",
  "api_updateUser_Failure"
)<UpdateUser["Request"], UpdateUser["Response"], Error>();
