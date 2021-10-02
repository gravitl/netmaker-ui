import { createSelector } from "reselect"
import { RootState } from "../../reducers"

const getNode = (state: RootState) => state.node
export const isFetchingNodes = createSelector(getNode, (node) => node.isFetching)
export const getNodes = createSelector(getNode, (node) => node.nodes)
