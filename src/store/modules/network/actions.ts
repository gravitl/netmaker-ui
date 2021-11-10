import { createAsyncAction } from 'typesafe-actions'
import {
  CreateNetworkPayload,
  DeleteNetworkPayload,
  GetNetworksPayload,
  UpdateNetworkPayload,
  CreateAccessKeyPayload,
  GetAccessKeysPayload,
  DeleteAccessKeyPayload,
  IndexNetworkPayload,
} from './types'

export const clearMetadata = createAsyncAction(
  'network_clearMetadata_Request',
  'network_clearMetadata_Success',
  'network_clearMetadata_Failure'

)<IndexNetworkPayload['Request'], IndexNetworkPayload['Response'], Error>()

export const getNetworks = createAsyncAction(
  'network_getNetworks_Request',
  'network_getNetworks_Success',
  'network_getNetworks_Failure'
)<GetNetworksPayload['Request'], GetNetworksPayload['Response'], Error>()

export const updateNetwork = createAsyncAction(
  'network_updateNetwork_Request',
  'network_updateNetwork_Success',
  'network_updateNetwork_Failure'
)<UpdateNetworkPayload['Request'], UpdateNetworkPayload['Response'], Error>()

export const deleteNetwork = createAsyncAction(
  'network_deleteNetwork_Request',
  'network_deleteNetwork_Success',
  'network_deleteNetwork_Failure'
)<DeleteNetworkPayload['Request'], DeleteNetworkPayload['Response'], Error>()

export const createNetwork = createAsyncAction(
  'network_createNetwork_Request',
  'network_createNetwork_Success',
  'network_createNetwork_Failure'
)<CreateNetworkPayload['Request'], CreateNetworkPayload['Response'], Error>()

export const createAccessKey = createAsyncAction(
  'network_createAccessKey_Request',
  'network_createAccessKey_Success',
  'network_createAccessKey_Failure'
)<
  CreateAccessKeyPayload['Request'],
  CreateAccessKeyPayload['Response'],
  Error
>()

export const getAccessKeys = createAsyncAction(
  'network_getAccessKeys_Request',
  'network_getAccessKeys_Success',
  'network_getAccessKeys_Failure'
)<GetAccessKeysPayload['Request'], GetAccessKeysPayload['Response'], Error>()

export const deleteAccessKey = createAsyncAction(
  'network_deleteAccessKey_Request',
  'network_deleteAccessKey_Success',
  'network_deleteAccessKey_Failure'
)<
  DeleteAccessKeyPayload['Request'],
  DeleteAccessKeyPayload['Response'],
  Error
>()
