import { Network, NetworkPayload } from "./types";

export const networkToNetworkPayload = (network: Network): NetworkPayload => {
  return ({
    ...network,
    defaultsaveconfig: network.defaultsaveconfig ? "yes" : "no",
    allowmanualsignup: network.allowmanualsignup ? "yes" : "no",
    islocal: network.islocal ? "yes" : "no",
    isdualstack: network.isdualstack ? "yes" : "no",
    isipv4: network.isipv4 ? "yes" : "no",
    isipv6: network.isipv6 ? "yes" : "no",
    isgrpchub: network.isgrpchub ? "yes" : "no",
    defaultudpholepunch: network.defaultudpholepunch ? "yes" : "no",
  })
}
export const networkPayloadToNetwork = (network: NetworkPayload): Network => {
  return ({
    ...network,
    defaultsaveconfig: network.defaultsaveconfig === "yes" ? true : false,
    allowmanualsignup: network.allowmanualsignup === "yes" ? true : false,
    islocal: network.islocal === "yes" ? true : false,
    isdualstack: network.isdualstack === "yes" ? true : false,
    isipv4: network.isipv4 === "yes" ? true : false,
    isipv6: network.isipv6 === "yes" ? true : false,
    isgrpchub: network.isgrpchub === "yes" ? true : false,
    defaultudpholepunch: network.defaultudpholepunch === "yes" ? true : false,
  })
}