import { createAction, createAsyncAction } from 'typesafe-actions'
import {
  GetHostsPayload,
  UpdateHostPayload,
  DeleteHostPayload,
  UpdateHostNetworksPayload,
  Host,
  DeleteHostRelayPayload,
  CreateHostRelayPayload,
} from '.'

export const getHosts = createAsyncAction(
  'Hosts_getHosts_Request',
  'Hosts_getHosts_Success',
  'Hosts_getHosts_Failure'
)<GetHostsPayload['Request'], GetHostsPayload['Response'], Error>()

export const updateHost = createAsyncAction(
  'Hosts_updateHosts_Request',
  'Hosts_updateHosts_Success',
  'Hosts_updateHosts_Failure'
)<UpdateHostPayload['Request'], UpdateHostPayload['Response'], Error>()

export const updateHostNetworks = createAsyncAction(
  'Hosts_updateHostNetworks_Request',
  'Hosts_updateHostNetworks_Success',
  'Hosts_updateHostNetworks_Failure'
)<
  UpdateHostNetworksPayload['Request'],
  { networks: UpdateHostNetworksPayload['Response']; hostid: Host['id'] },
  Error
>()

export const deleteHost = createAsyncAction(
  'Hosts_deleteHosts_Request',
  'Hosts_deleteHosts_Success',
  'Hosts_deleteHosts_Failure'
)<DeleteHostPayload['Request'], DeleteHostPayload['Response'], Error>()

export const createHostRelay = createAsyncAction(
  'Hosts_createHostRelay_Request',
  'Hosts_createHostRelay_Success',
  'Hosts_createHostRelay_Failure'
)<CreateHostRelayPayload['Request'], CreateHostRelayPayload['Response'], Error>()

export const deleteHostRelay = createAsyncAction(
  'Hosts_deleteHostRelay_Request',
  'Hosts_deleteHostRelay_Success',
  'Hosts_deleteHostRelay_Failure'
)<DeleteHostRelayPayload['Request'], DeleteHostRelayPayload['Response'], Error>()

export const clearHosts = createAction('Hosts_clearHosts')<string>()
