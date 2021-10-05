import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "typesafe-actions";
import { Network } from "../../../store/modules/network";
import { Node } from "../../../store/modules/node";
import { nodeSelectors } from "../../../store/selectors";

const nodeByIdPredicate = (id: Node["id"]) => (node: Node) => node.id === id;
const nodesByNetworkIdPredicate = (id: Network["netid"]) => (node: Node) => node.network === id;

const makeSelectNode = () =>
  createSelector(
    nodeSelectors.getNodes,
    (_: RootState, id: Node["id"]) => id,
    (nodes, id) => nodes.find(nodeByIdPredicate(id))
  );

export const useNode = (id: Node["id"]) => {
  const selectNode = useMemo(makeSelectNode, []);
  return useSelector<RootState, Node | undefined>((state) =>
    selectNode(state, id)
  );
};

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
