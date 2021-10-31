import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { authSelectors } from '../store/selectors'

export const PrivateRoute: React.FC<React.PropsWithChildren<RouteProps>> = ({
  children,
  ...rest
}) => {
  const isLoggedIn = useSelector(authSelectors.getLoggedIn)
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
}
