import { createReducer } from 'typesafe-actions'
import { routerPop, routerPush, routerReplace } from './actions'
import { RouterState } from './types'

export const reducer = createReducer<RouterState>({}).handleAction(
  [routerPush, routerReplace, routerPop],
  (state, action) => ({
    prevLocation: state.location,
    history: action.payload.history,
    location: action.payload.location,
  })
)
