import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { DEBUG } from '../config'

import { RootAction as RA } from './actions'
import { createRootReducer, RootState as RS } from './reducers'
import { createRootSaga } from './sagas'

declare module 'typesafe-actions' {
  export type RootAction = RA
  export type RootState = RS
  interface Types {
    RootAction: RootAction
    RootState: RootState
  }
}

const logger = createLogger({
  level: 'info',
})

export const createReduxStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  let enhancer
  if (DEBUG) {
    enhancer = applyMiddleware(logger, sagaMiddleware)
  } else {
    enhancer = applyMiddleware(sagaMiddleware)
  }
  const store = createStore(createRootReducer(), enhancer)
  sagaMiddleware.run(createRootSaga())
  return store
}

export const useMintableSelector: TypedUseSelectorHook<RS> = useSelector
