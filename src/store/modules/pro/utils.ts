import { networkPayloadToNetwork } from "../network/utils";
import { nodePayloadToNode } from "../node/utils";
import { NetworkUserData, NetworkUserDataMap, NetworkUserDataMapPayload } from "./types";

export function netUserDataPayloadToNetUserData(payload: NetworkUserDataMapPayload): NetworkUserDataMap {
    let newMap = {} as NetworkUserDataMap

    if (!!payload) {
        Object.keys(payload).map(network => {
          newMap[network] = {} as NetworkUserData
          newMap[network].nodes = payload[network].nodes.map(n => nodePayloadToNode(n))
          newMap[network].vpns = payload[network].vpns.map(n => nodePayloadToNode(n))
          newMap[network].networks = payload[network].networks.map(n => networkPayloadToNetwork(n))
          newMap[network].clients = payload[network].clients
          newMap[network].user = payload[network].user
          return null
        })
    }

    return newMap
}
