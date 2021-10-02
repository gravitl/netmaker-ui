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

export const timeConverter = (UNIX_timestamp: number) => {
  const a = new Date(UNIX_timestamp * 1000);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = date + ' ' + month + ', ' + year + ' - ' + hour + ':' + min + ':' + sec ;
  return time;
}
export const datePickerConverter = (UNIX_timestamp: number) => {
  const a = new Date(UNIX_timestamp * 1000);
  const months = [1,2,3,4,5,6,7,8,9,10,11,12];
  const year = a.getFullYear();
  const month = months[a.getMonth()] < 10 ? '0' + months[a.getMonth()] : a.getMonth()+months[a.getMonth()];
  const date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
  const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  const time = year + '-' + month + '-' + date + 'T' + hour + ':' + min ;
  return time;
}