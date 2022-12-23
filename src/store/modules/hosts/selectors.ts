import { createSelector } from 'reselect'
import { RootState } from '../../reducers'
import { Host } from './types'

const getHostsState = (state: RootState) => state.hosts

export const isProcessingHosts = createSelector(
  getHostsState,
  (hostsState) => hostsState.isProcessing
)


const mockHosts: Host[] = [
  {
    id: 'hostid0',
    name: 'host-zero',
    version: 'v0.18.0',
    os: 'linux',
    isdefault: true,
    localaddress: '10.12.233.5',
    interfaces: [
      {
        name: 'enp8s0',
        address: { IP: '', Mask: '' },
        addressString: '10.12.233.5',
      },
    ],
    nodes: [
      {
        id: 'ed2d1c93-f879-4b94-a62b-6557c4cfde8e',
        network: 'testnet',
      },
      {
        id: '358e6623-d668-48c5-b2ca-5925c5f22d6d',
        network: 'virt-net',
      },
    ],
  } as unknown as Host,
  {
    id: 'hostid1',
    name: 'host-one',
    version: 'v0.18.0',
    os: 'darwin',
    isdefault: false,
    localaddress: '10.0.236.25',
    interfaces: [],
    nodes: [],
  } as unknown as Host,
]


export const getHosts = createSelector(
  getHostsState,
  // (hostsState) => hostsState.hosts
  (hostsState) => mockHosts
)
