import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import { clearCurrentMetrics, getExtMetrics, getMetrics, getNodeMetrics, getServerConfig, getServerLogs } from './actions'
import { ServerConfig, NodeMetricsContainer, MetricsContainer, ExtMetrics } from './types'

export const reducer = createReducer({
  config: {} as ServerConfig,
  isFetching: false,
  logs: [] as string[],
  nodeMetrics: {} as NodeMetricsContainer | undefined,
  metrics: {} as MetricsContainer | undefined,
  attempts: 0,
  fetchedNodeMetrics: false,
  extMetrics: {} as ExtMetrics,
  fetchingExtMetrics: false,
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
      draftState.config.IsEE = action.payload.IsEE === 'yes'
    })
  )
  .handleAction(getServerConfig['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.config = {} as ServerConfig
    })
  )
  .handleAction(getServerLogs['request'], (state, _) => 
    produce(state, (draftState) => {
      draftState.isFetching = true
      draftState.attempts++
    })
  )
  .handleAction(getServerLogs['success'], (state, payload) => 
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.logs = payload.payload.split('\n')
      draftState.attempts = 0
    })
  )
  .handleAction(getServerLogs['failure'], (state, _) => 
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.logs = []
    })
  )
  .handleAction(getMetrics['request'], (state, _) => 
    produce(state, (draftState) => {
      draftState.isFetching = true
      draftState.attempts++
    })
  )
  .handleAction(getMetrics['success'], (state, payload) => 
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.metrics = payload.payload
      draftState.attempts = 0
    })
  )
  .handleAction(getMetrics['failure'], (state, _) => 
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.metrics = undefined
    })
  )
  .handleAction(getExtMetrics['request'], (state, _) => 
    produce(state, (draftState) => {
      draftState.fetchingExtMetrics = true
    })
  )
  .handleAction(getExtMetrics['failure'], (state, _) => 
    produce(state, (draftState) => {
      draftState.fetchingExtMetrics = false
      draftState.extMetrics = {}
    })
  )
  .handleAction(getExtMetrics['success'], (state, { payload }) => 
    produce(state, (draftState) => {
      draftState.fetchingExtMetrics = false
      draftState.extMetrics = payload
    })
  )
  .handleAction(getNodeMetrics['request'], (state, _) => 
    produce(state, (draftState) => {
      draftState.isFetching = true
      draftState.attempts++
      draftState.fetchedNodeMetrics = false
    })
  )
  .handleAction(getNodeMetrics['success'], (state, payload) => 
    produce(state, (draftState) => {
      draftState.nodeMetrics = payload.payload
      draftState.attempts = 0
      draftState.fetchedNodeMetrics = true
      draftState.isFetching = false
    })
  )
  .handleAction(getNodeMetrics['failure'], (state, _) => 
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.nodeMetrics = undefined
    })
  )
  .handleAction(clearCurrentMetrics, (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = false
      draftState.metrics = undefined
      draftState.nodeMetrics = undefined
    })
  )
