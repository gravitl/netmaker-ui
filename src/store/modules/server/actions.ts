import { createAction, createAsyncAction } from 'typesafe-actions'
import {
  GetServerConfigPayload,
  LogsPayload,
  Metrics,
  ExtMetricsPayload,
  AllNodesMetricsPayload,
  NetworkMetricsPayload,
} from './types'

export const getServerConfig = createAsyncAction(
  'api_getServerConfig_Request',
  'api_getServerConfig_Success',
  'api_getServerConfig_Failure'
)<
  GetServerConfigPayload['Request'],
  GetServerConfigPayload['Response'],
  Error
>()

export const getServerLogs = createAsyncAction(
  'api_getServerLogs_Request',
  'api_getServerLogs_Success',
  'api_getServerLogs_Failure'
)<LogsPayload['Request'], LogsPayload['Response'], Error>()

export const getNodeMetrics = createAsyncAction(
  'api_getNodeMetrics_Request',
  'api_getNodeMetrics_Success',
  'api_getNodeMetrics_Failure'
)<
  AllNodesMetricsPayload['Request'],
  AllNodesMetricsPayload['Response'],
  Error
>()

export const getMetrics = createAsyncAction(
  'api_getMetrics_Request',
  'api_getMetrics_Success',
  'api_getMetrics_Failure'
)<Metrics['Request'], Metrics['Response'], Error>()

export const getNetworkMetrics = createAsyncAction(
  'api_getNetworkMetrics_Request',
  'api_getNetworkMetrics_Success',
  'api_getNetworkMetrics_Failure'
)<NetworkMetricsPayload['Request'], NetworkMetricsPayload['Response'], Error>()

export const getExtMetrics = createAsyncAction(
  'api_getExtMetrics_Request',
  'api_getExtMetrics_Success',
  'api_getExtMetrics_Failure'
)<ExtMetricsPayload['Request'], ExtMetricsPayload['Response'], Error>()

export const clearCurrentMetrics = createAction('clearCurrentMetrics')<void>()
