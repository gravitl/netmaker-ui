import React from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import { Header } from './Header'

import { Dashboard } from './dashboard/Dashboard'
import { Nodes } from './nodes/Nodes'
import { Login } from './login/Login'
import { Networks } from './networks/Networks'
import { PrivateRoute } from './PrivateRoute'

function NoMatch() {
  const location = useLocation()
  return (
    <div>
      No match for <code>{location.pathname}</code>
    </div>
  )
}

function Routes() {
  let location = useLocation()

  // This piece of state is set when one of the
  // gallery links is clicked. The `background` state
  // is the location that we were at when one of
  // the gallery links was clicked. If it's there,
  // use it as the location for the <Switch> so
  // we show the gallery in the background, behind
  // the modal.
  const from = (location.state as any)?.from

  return (
    <>
      <Header />
      <Switch location={from || location}>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <PrivateRoute path="/networks">
          <Networks />
        </PrivateRoute>
        <PrivateRoute path="/nodes">
          <Nodes />
        </PrivateRoute>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>

      {/* Show the modal when a background page is set */}
      {from && <Route path="/login" children={<Login />} />}
    </>
  )
}
export default Routes
