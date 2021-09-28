import { createAsyncAction } from "typesafe-actions";
import { DeleteNetworkPayload, GetNetworksPayload, UpdateNetworkPayload } from "./types";

export const getNetworks = createAsyncAction(
  "network_getNetworks_Request",
  "network_getNetworks_Success",
  "network_getNetworks_Failure"
)<GetNetworksPayload["Request"], GetNetworksPayload["Response"], Error>();

export const updateNetwork = createAsyncAction(
  "network_updateNetwork_Request",
  "network_updateNetwork_Success",
  "network_updateNetwork_Failure"
)<UpdateNetworkPayload["Request"], UpdateNetworkPayload["Response"], Error>();

export const deleteNetwork = createAsyncAction(
  "network_deleteNetwork_Request",
  "network_deleteNetwork_Success",
  "network_deleteNetwork_Failure"
)<DeleteNetworkPayload["Request"], DeleteNetworkPayload["Response"], Error>();
