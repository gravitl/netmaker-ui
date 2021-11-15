import { createAsyncAction, createAction } from 'typesafe-actions'
import {
  DeleteDNSEntryPayload,
  GetDnsEntriesPayload,
  RefreshPublicKeysPayload,
} from '~store/types'
import {
  CreateNetworkPayload,
  DeleteNetworkPayload,
  GetNetworksPayload,
  UpdateNetworkPayload,
  CreateAccessKeyPayload,
  GetAccessKeysPayload,
  DeleteAccessKeyPayload,
  CreateDNSEntryPayload,
  TempKey,
} from './types'

export const clearTempKey = createAction('clearTempKey')<void>()
export const setTempKey = createAction('setTempKey')<TempKey>()

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

export const getDnsEntries = createAsyncAction(
  'network_getDnsEntries_Request',
  'network_getDnsEntries_Success',
  'network_getDnsEntries_Failure'
)<GetDnsEntriesPayload['Request'], GetDnsEntriesPayload['Response'], Error>()

export const createDnsEntry = createAsyncAction(
  'network_createDnsEntry_Request',
  'network_createDnsEntry_Success',
  'network_createDnsEntry_Failure'
)<CreateDNSEntryPayload['Request'], CreateDNSEntryPayload['Response'], Error>()

export const deleteDnsEntry = createAsyncAction(
  'network_deleteDnsEntry_Request',
  'network_deleteDnsEntry_Success',
  'network_deleteDnsEntry_Failure'
)<DeleteDNSEntryPayload['Request'], DeleteDNSEntryPayload['Response'], Error>()

export const deleteAccessKey = createAsyncAction(
  'network_deleteAccessKey_Request',
  'network_deleteAccessKey_Success',
  'network_deleteAccessKey_Failure'
)<
  DeleteAccessKeyPayload['Request'],
  DeleteAccessKeyPayload['Response'],
  Error
>()

export const refreshPublicKeys = createAsyncAction(
  'network_refreshPublicKeys_Request',
  'network_refreshPublicKeys_Success',
  'network_refreshPublicKeys_Failure'
)<
  RefreshPublicKeysPayload['Request'],
  RefreshPublicKeysPayload['Response'],
  Error
>()
