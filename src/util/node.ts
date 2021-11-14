import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { RootState } from 'typesafe-actions'
import { Node } from '~modules/node'
import { nodeSelectors } from '~store/selectors'

const nodeByIdPredicate = (id: Node['id']) => (node: Node) => node.id === id

const nodeByNamePredicate = (name: Node['name']) => (node: Node) => node.name === name

const makeSelectNodeByID = () =>
  createSelector(
    nodeSelectors.getNodes,
    (_: RootState, id: Node['id']) => id,
    (nodes, id) => nodes.find(nodeByIdPredicate(id))
  )

export const useNodeById = (id: Node['id']) => {
  const selectNode = useMemo(makeSelectNodeByID, [])
  return useSelector<RootState, Node | undefined>((state) =>
    selectNode(state, id)
  )
}

const makeSelectNode = () =>
  createSelector(
    nodeSelectors.getNodes,
    (_: RootState, name: Node['name']) => name,
    (nodes, name) => nodes.find(nodeByNamePredicate(name))
  )

export const useNode = (name: Node['name']) => {
  const selectNode = useMemo(makeSelectNode, [])
  return useSelector<RootState, Node | undefined>((state) =>
    selectNode(state, name)
  )
}

export const filterIngressGateways = (nodes: Node[]) => {
  return nodes.filter(node => node.ingressgatewayrange)
}
