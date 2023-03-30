import { Network, NetworkPayload } from './types'

export const networkToNetworkPayload = (network: Network): NetworkPayload => {
  
  if (!!network.prosettings) {
    if (typeof network.prosettings.allowedgroups === 'string') {
      network.prosettings.allowedgroups = convertStringToArray(network.prosettings.allowedgroups)
    }
    if (typeof network.prosettings.allowedusers === 'string') {
      network.prosettings.allowedusers = convertStringToArray(network.prosettings.allowedusers)
    }
  }

  return {
    ...network,
    defaultmtu: Number(network.defaultmtu),
    defaultlistenport: Number(network.defaultlistenport),
    defaultkeepalive: Number(network.defaultkeepalive),
    isipv4: network.isipv4 ? 'yes' : 'no',
    isipv6: network.isipv6 ? 'yes' : 'no',
    defaultudpholepunch: network.defaultudpholepunch ? 'yes' : 'no',
    defaultacl: network.defaultacl ? 'yes' : 'no',
    prosettings: !!network.prosettings ? {
      defaultaccesslevel: Number(network.prosettings.defaultaccesslevel),
      defaultuserclientlimit: Number(network.prosettings.defaultuserclientlimit),
      defaultusernodelimit: Number(network.prosettings.defaultusernodelimit),
      allowedgroups: network.prosettings.allowedgroups,
      allowedusers: network.prosettings.allowedusers,
    } : undefined
  }
}
export const networkPayloadToNetwork = (network: NetworkPayload): Network => {
  return {
    ...network,
    defaultmtu: Number(network.defaultmtu),
    defaultlistenport: Number(network.defaultlistenport),
    defaultkeepalive: Number(network.defaultkeepalive),
    isipv4: network.isipv4 === 'yes',
    isipv6: network.isipv6 === 'yes',
    defaultudpholepunch: network.defaultudpholepunch === 'yes',
    defaultacl: network.defaultacl === 'yes',
    prosettings: !!network.prosettings ? {
      defaultaccesslevel: Number(network.prosettings.defaultaccesslevel),
      defaultuserclientlimit: Number(network.prosettings.defaultuserclientlimit),
      defaultusernodelimit: Number(network.prosettings.defaultusernodelimit),
      allowedgroups: network.prosettings.allowedgroups,
      allowedusers: network.prosettings.allowedusers,
    } : undefined
  }
}

const convertStringToArray = (commaSeparatedData: string) => {
  const data = commaSeparatedData.split(',')
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].trim()
  }
  return data
}
