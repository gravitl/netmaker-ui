import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { User } from '~store/types'
import { authSelectors } from '~store/selectors'
import { LocationDescriptor } from 'history'

interface PrivateRouteProps extends RouteProps {
  condition?: (user?: User) => boolean
  to?: LocationDescriptor
}

export const PrivateRoute: React.FC<React.PropsWithChildren<PrivateRouteProps>> = ({
  children,
  condition,
  to,
  ...rest
}) => {
  const isLoggedIn = useSelector(authSelectors.getLoggedIn)
  const user = useSelector(authSelectors.getUser)
  const showRoute = condition ? condition(user) : isLoggedIn
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return showRoute ? (
          children
        ) : (
          <Redirect
            to={to ? to : {
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
}
