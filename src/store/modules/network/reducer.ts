import { produce } from "immer";
import { createReducer } from "typesafe-actions";
import { getNetworks } from "./actions";
import { Network } from "./types";
import { networkPayloadToNetwork } from "./utils";

export const reducer = createReducer({
  networks: [] as Array<Network>,
  isFetching: false as boolean,
})
  .handleAction(getNetworks["request"], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = true;
    })
  )
  .handleAction(getNetworks["success"], (state, action) =>
    produce(state, (draftState) => {
      draftState.networks = action.payload.map(networkPayloadToNetwork);
      draftState.isFetching = false;
    })
  )
  .handleAction(getNetworks["failure"], (state, _) =>
    produce(state, (draftState) => {
      draftState.networks = [];
      draftState.isFetching = false;
    })
  );
