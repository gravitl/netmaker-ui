import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getAuth = (state: RootState) => state.auth

export const getToken = createSelector(getAuth, (auth) => auth.token)
export const getUser = createSelector(getAuth, (auth) => auth.user)
export const getLoggedIn = createSelector(
  getAuth,
  (auth) => !!auth.user && Date.now() / 1000 < auth.user.exp
)
export const isLogginIn = createSelector(getAuth, (auth) => auth.isLoggingIn)
