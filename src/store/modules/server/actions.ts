import { createAsyncAction } from 'typesafe-actions'
import { GetServerConfigPayload, LogsPayload } from './types'

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
