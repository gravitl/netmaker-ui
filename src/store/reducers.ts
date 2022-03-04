import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'

import { reducer as auth } from './modules/auth'
import { reducer as api } from './modules/api'
import { reducer as network } from './modules/network'
import { reducer as node } from './modules/node'
import { reducer as server } from './modules/server'
import { reducer as router } from './modules/router'
import { reducer as acls } from './modules/acls'

export const createRootReducer = () =>
  combineReducers({
    auth,
    api,
    network,
    node,
    server,
    router,
    acls,
  })

export type RootState = StateType<ReturnType<typeof createRootReducer>>
