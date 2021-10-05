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
    defaultsaveconfig: network.defaultsaveconfig === "yes",
    allowmanualsignup: network.allowmanualsignup === "yes",
    islocal: network.islocal === "yes",
    isdualstack: network.isdualstack === "yes",
    isipv4: network.isipv4 === "yes",
    isipv6: network.isipv6 === "yes",
    isgrpchub: network.isgrpchub === "yes",
    defaultudpholepunch: network.defaultudpholepunch === "yes",
  })
}