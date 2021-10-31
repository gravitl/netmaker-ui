import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { RootState } from 'typesafe-actions'
import { Node } from '~modules/node'
import { nodeSelectors } from '~store/selectors'

const nodeByIdPredicate = (id: Node['id']) => (node: Node) => node.id === id

const makeSelectNode = () =>
  createSelector(
    nodeSelectors.getNodes,
    (_: RootState, id: Node['id']) => id,
    (nodes, id) => nodes.find(nodeByIdPredicate(id))
  )

export const useNode = (id: Node['id']) => {
  const selectNode = useMemo(makeSelectNode, [])
  return useSelector<RootState, Node | undefined>((state) =>
    selectNode(state, id)
  )
}
