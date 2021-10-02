import { produce } from "immer";
import { createReducer } from "typesafe-actions";
import { getNodes } from "../api/actions";
import { Node } from "./types";

export const reducer = createReducer({
  nodes: [] as Array<Node>,
  isFetching: false as boolean,
})
  .handleAction(getNodes["request"], (state, _) =>
    produce(state, (draftState) => {
      draftState.isFetching = true;
    })
  )
  .handleAction(getNodes["success"], (state, action) =>
    produce(state, (draftState) => {
      draftState.nodes = action.payload;
      draftState.isFetching = false;
    })
  )
  .handleAction(getNodes["failure"], (state, _) =>
    produce(state, (draftState) => {
      draftState.nodes = [];
      draftState.isFetching = false;
    })
  );
