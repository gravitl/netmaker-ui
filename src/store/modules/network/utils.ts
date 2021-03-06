import { Network, NetworkPayload } from './types'

export const networkToNetworkPayload = (network: Network): NetworkPayload => {
  return {
    ...network,
    defaultmtu: Number(network.defaultmtu),
    defaultlistenport: Number(network.defaultlistenport),
    defaultkeepalive: Number(network.defaultkeepalive),
    allowmanualsignup: network.allowmanualsignup ? 'yes' : 'no',
    islocal: network.islocal ? 'yes' : 'no',
    isipv4: network.isipv4 ? 'yes' : 'no',
    isipv6: network.isipv6 ? 'yes' : 'no',
    defaultudpholepunch: network.defaultudpholepunch ? 'yes' : 'no',
    ispointtosite: network.ispointtosite ? 'yes' : 'no',
    defaultacl: network.defaultacl ? 'yes' : 'no',
  }
}
export const networkPayloadToNetwork = (network: NetworkPayload): Network => {
  return {
    ...network,
    defaultmtu: Number(network.defaultmtu),
    defaultlistenport: Number(network.defaultlistenport),
    defaultkeepalive: Number(network.defaultkeepalive),
    allowmanualsignup: network.allowmanualsignup === 'yes',
    islocal: network.islocal === 'yes',
    isipv4: network.isipv4 === 'yes',
    isipv6: network.isipv6 === 'yes',
    defaultudpholepunch: network.defaultudpholepunch === 'yes',
    ispointtosite: network.ispointtosite === 'yes',
    defaultacl: network.defaultacl === 'yes',
  }
}
