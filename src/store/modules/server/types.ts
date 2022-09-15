export interface ServerConfig {
  APIConnString: string //""
  APIHost: string // "hakeee.duckdns.org"
  APIPort: number // "8081"
  AgentBackend: boolean // "on"
  AllowedOrigin: string // "*"
  ClientMode: boolean // "on"
  CoreDNSAddr: string // "89.177.140.210"
  DNSMode: boolean // "off"
  Database: string // "sqlite"
  DefaultNodeLimit: number // 0
  DisableDefaultNet: boolean // "off"
  DisableRemoteIPCheck: boolean // "off"
  GRPCConnString: string // ""
  GRPCHost: string // "hakeee.duckdns.org"
  GRPCPort: number // "50051"
  GRPCSSL: boolean // "off"
  GRPCSecure: string // ""
  MasterKey: string // "(hidden)"
  Platform: string // "linux"
  RestBackend: boolean // "on"
  SQLConn: string // ""
  Verbosity: number // 0
  Version: string // "v0.7.3"
  RCE: boolean // "on"
  IsEE: boolean // yes or no
}
export interface GetServerConfigPayload {
  Request: {
    token: string
  }
  Response: {
    APIConnString: string
    APIHost: string
    APIPort: string
    AgentBackend: string
    AllowedOrigin: string
    ClientMode: string
    CoreDNSAddr: string
    DNSMode: string
    Database: string
    DefaultNodeLimit: number
    DisableDefaultNet: string
    DisableRemoteIPCheck: string
    GRPCConnString: string
    GRPCHost: string
    GRPCPort: string
    GRPCSSL: string
    GRPCSecure: string
    MasterKey: string
    Platform: string
    RestBackend: string
    SQLConn: string
    Verbosity: number
    Version: string
    RCE: string
    IsEE: string // yes or no
  }
}

export interface LogsPayload {
  Request: undefined
  Response: string
}

export type MetricID = string

export type NodeMetricsTable = Record<string, NodeMetric>

export type MetricsTable = Record<string, NodeMetricsContainer>

export interface NodeMetricsContainer {
  connectivity: NodeMetricsTable
}

export interface MetricsContainer {
  nodes: MetricsTable
}

export interface NodeMetric {
  node_name: string
  uptime: number
  totaltime: number
  latency: number
  totalreceived: number
  totalsent: number
  actualuptime: number
  percentup: number
  connected: boolean
}

export interface NodeMetricsID {
  ID: string
  Network: string
}

export interface NodeMetrics {
  Request: NodeMetricsID
  Response: NodeMetricsContainer
}

export interface Metrics {
  Request: string | undefined
  Response: MetricsContainer
}
