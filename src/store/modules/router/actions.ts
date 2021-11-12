import { createAction } from 'typesafe-actions'
import { RouterAction } from './types'

const RouterActionPrefix = `router`

export const routerPush = createAction(
  `${RouterActionPrefix}/PUSH`,
)<RouterAction>()

export const routerPop = createAction(
  `${RouterActionPrefix}/POP`,
)<RouterAction>()

export const routerReplace = createAction(
  `${RouterActionPrefix}/REPLACE`,
)<RouterAction>()

export const routerActions = {
  POP: routerPop,
  PUSH: routerPush,
  REPLACE: routerReplace,
}