import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "typesafe-actions";
import { Network } from "../../../store/modules/network/types";
import { networkSelectors } from "../../../store/selectors";

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
