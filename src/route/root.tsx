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
import { UsersEE } from '../ee/users/UsersEE'
import { DNS } from './dns/DNS'
import { Graphs } from './graph/Graphs'
import { NodeAcls } from './node_acls/NodeACLs'
import { ServerLogs } from './logs/ServerLogs'
import { MetricRoute } from '../ee/metrics/MetricRoute'
import { UserGroups } from './usergroups/UserGroups'
import { NetworkUsers } from './networkusers/NetworkUsers'
import ProDrawerNotAdmin from '../proroute/prodrawer/ProDrawerNotAdmin'
import { authSelectors, serverSelectors } from '~store/types'
import { useSelector } from 'react-redux'
import { ProUserView } from '../proroute/prouser/ProUserView'
import WelcomeCard from '../proroute/proaccessleveldashboards/components/WelcomeCard'
import { NotFound } from '~util/errorpage'
import { UsersCommunity } from './users/UsersCommunity'

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
  const user = useSelector(authSelectors.getUser)
  const serverConfig = useSelector(serverSelectors.getServerConfig)

  return (
    <Grid container justifyContent="right">
      <Grid item xs={12}>
        <CustomDrawer />
      </Grid>
      {!user?.isAdmin && (
        <>
          <Grid item xs={12}>
            <ProDrawerNotAdmin />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Switch location={from || location}>
          <PrivateRoute exact path="/">
            {user?.isAdmin ? <Dashboard /> : <WelcomeCard />}
          </PrivateRoute>
          <PrivateRoute path="/networks">
            <Networks />
          </PrivateRoute>
          <PrivateRoute path="/prouser">
            {user?.isAdmin ? <Dashboard /> : <ProUserView />}
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
          {serverConfig.IsEE && (
            <>
            <PrivateRoute path="/metrics">
              <MetricRoute />
            </PrivateRoute>
            <PrivateRoute path="/ec">
              <MetricRoute />
            </PrivateRoute>
            </>
          )}
          <PrivateRoute path="/usergroups">
            <UserGroups />
          </PrivateRoute>
          <PrivateRoute path="/user-permissions">
            <NetworkUsers />
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
            {serverConfig.IsEE ? <UsersEE /> : <UsersCommunity />}
          </PrivateRoute>
          <Route path="/login" children={<Login />} />
          <Route path="*">
            <NotFound />
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
