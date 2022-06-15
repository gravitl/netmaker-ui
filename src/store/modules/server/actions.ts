import { createAction, createAsyncAction } from 'typesafe-actions'
import { GetServerConfigPayload, LogsPayload, NodeMetrics, Metrics } from './types'

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
  'api_getServerLogs_Failure',
)<
  LogsPayload['Request'],
  LogsPayload['Response'],
  Error
>()

export const getNodeMetrics = createAsyncAction(
  'api_getNodeMetrics_Request',
  'api_getNodeMetrics_Success',
  'api_getNodeMetrics_Failure',
)<
  NodeMetrics['Request'],
  NodeMetrics['Response'],
  Error
>()

export const getMetrics = createAsyncAction(
  'api_getMetrics_Request',
  'api_getMetrics_Success',
  'api_getMetrics_Failure',
)<
  Metrics['Request'],
  Metrics['Response'],
  Error
>()

export const clearCurrentMetrics = createAction('clearCurrentMetrics')<void>()
