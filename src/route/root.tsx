import React from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'

import { Dashboard } from './dashboard/Dashboard'
import { Nodes } from './nodes/Nodes'
import { Login } from './login/Login'
import { Networks } from './networks/Networks'
import { PrivateRoute } from './PrivateRoute'
import CustomDrawer from '~components/drawer/CustomDrawer'
import { Grid } from '@mui/material'
import { AccessKeys } from './accesskeys/AccessKeys'
import { ExtClients } from './extclients/ExtClients'
import { RouterState } from '~store/modules/router/Component'
import { Users } from './users/Users'
import { DNS } from './dns/DNS'
import { Graphs } from './graph/Graphs'
import { NodeAcls } from './node_acls/NodeACLs'
import { ServerLogs } from './logs/ServerLogs'
import { Metrics } from './metrics/Metrics'

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
    <Grid container justifyContent="right">
      <Grid item xs={12}>
        <CustomDrawer />
      </Grid>
      <Grid item xs={12}>
        <Switch location={from || location}>
          <PrivateRoute exact path="/">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute path="/networks">
            <Networks />
          </PrivateRoute>
          <PrivateRoute path="/nodes">
            <Nodes />
          </PrivateRoute>
          <PrivateRoute path="/access-keys">
            <AccessKeys />
          </PrivateRoute>
          <PrivateRoute path="/ext-clients">
            <ExtClients />
          </PrivateRoute>
          <PrivateRoute path="/dns">
            <DNS />
          </PrivateRoute>
          <PrivateRoute path="/graphs">
            <Graphs />
          </PrivateRoute>
          <PrivateRoute path="/acls">
            <NodeAcls />
          </PrivateRoute>
          <PrivateRoute path="/logs">
            <ServerLogs />
          </PrivateRoute>
          <PrivateRoute path="/metrics">
            <Metrics />
          </PrivateRoute>
          <PrivateRoute
            path="/users"
            to={{ pathname: '/' }}
            condition={(user) => {
              if (`/users/${user?.name}` === location.pathname && !!user)
                return true
              return !!user?.isAdmin
            }}
          >
            <Users />
          </PrivateRoute>
          <Route path="/login" children={<Login />} />
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
        <RouterState />
        {/* Show the modal when a background page is set */}
        {from && <Route path="/login" children={<Login />} />}
      </Grid>
    </Grid>
  )
}
export default Routes
