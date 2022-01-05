import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import { getServerConfig } from './actions'
import { ServerConfig } from './types'

export const reducer = createReducer({
  config: {} as ServerConfig,
  isFetching: false,
})
  .handleAction(getServerConfig['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = true
    })
  )
  .handleAction(getServerConfig['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.config.APIConnString = action.payload.APIConnString
      draftState.config.APIHost = action.payload.APIHost
      draftState.config.APIPort = Number.parseInt(action.payload.APIPort) || -1
      draftState.config.AgentBackend = action.payload.AgentBackend === 'on'
      draftState.config.AllowedOrigin = action.payload.AllowedOrigin
      draftState.config.ClientMode = action.payload.ClientMode === 'on'
      draftState.config.CoreDNSAddr = action.payload.CoreDNSAddr
      draftState.config.DNSMode = action.payload.DNSMode === 'on'
      draftState.config.Database = action.payload.Database
      draftState.config.DefaultNodeLimit = action.payload.DefaultNodeLimit
      draftState.config.DisableDefaultNet =
        action.payload.DisableDefaultNet === 'on'
      draftState.config.DisableRemoteIPCheck =
        action.payload.DisableRemoteIPCheck === 'on'
      draftState.config.GRPCConnString = action.payload.GRPCConnString
      draftState.config.GRPCHost = action.payload.GRPCHost
      draftState.config.GRPCPort =
        Number.parseInt(action.payload.GRPCPort) || -1
      draftState.config.GRPCSSL = action.payload.GRPCSSL === 'on'
      draftState.config.GRPCSecure = action.payload.GRPCSecure
      draftState.config.MasterKey = action.payload.MasterKey
      draftState.config.Platform = action.payload.Platform
      draftState.config.RestBackend = action.payload.RestBackend === 'on'
      draftState.config.SQLConn = action.payload.SQLConn
      draftState.config.Verbosity = action.payload.Verbosity
      draftState.config.Version = action.payload.Version
      draftState.config.RCE = action.payload.RCE === 'on'
    })
  )
  .handleAction(getServerConfig['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.config = {} as ServerConfig
    })
  )
