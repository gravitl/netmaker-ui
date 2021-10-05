import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "typesafe-actions";
import { Network } from "../../../store/modules/network/types";
import { Node } from "../../../store/modules/node/types";
import { networkSelectors, nodeSelectors } from "../../../store/selectors";

const networkByNetIdPredicate = (netid: string) => (network: Network) =>
  network.netid === netid;

const makeSelectNetwork = () =>
  createSelector(
    networkSelectors.getNetworks,
    (_: RootState, netid: string) => netid,
    (networks, netid) =>
    networks.find(networkByNetIdPredicate(netid))
  )

export const useNetwork = (netid: string) => {
  const selectNetwork = useMemo(makeSelectNetwork, [])
  return useSelector<RootState, Network | undefined>((state) => selectNetwork(state, netid));
};

const nodesByNetworkIdPredicate = (id: Network["netid"]) => (node: Node) => node.network === id;

const makeSelectNodeByNetworkId = () =>
  createSelector(
    nodeSelectors.getNodes,
    (_: RootState, id: Network["netid"]) => id,
    (nodes, id) => nodes.filter(nodesByNetworkIdPredicate(id))
  );

export const useNodesByNetworkId = (id: Network["netid"]) => {
  const selectNodes = useMemo(makeSelectNodeByNetworkId, []);
  return useSelector<RootState, Array<Node> | undefined>((state) =>
    selectNodes(state, id)
  );
};

export const useNodeCountByNetworkId = ((id: Network["netid"]) => {
  const nodes = useNodesByNetworkId(id)
  if(nodes) {
    return nodes.length
  }
  return 0
});
