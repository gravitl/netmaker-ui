import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getRouter = (state: RootState) => state.router

export const getLocation = createSelector(getRouter, (state) => state.location)

export const getHistory = createSelector(getRouter, (state) => state.history)
