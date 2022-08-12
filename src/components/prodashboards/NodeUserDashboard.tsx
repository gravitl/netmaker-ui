import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import NodeAccessCard from './components/NetAdminCards/NodeAccessCard'
import ExtAccessCard from './components/NetAdminCards/ExtAccessCard'
import { ExtClientViewVpn } from './components/vpnview/components/ExtClientViewVpn'
import { NodeAccessView } from './components/NodeAccessView'

export const NodeUserDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.netadmindashboard'),
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={5}>
              <NodeAccessCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <ExtAccessCard />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/vpnview`}>
          <Grid>
            <ExtClientViewVpn />
          </Grid>
        </Route>
        <Route path={`${path}/nodeview`}>
          <Grid>
            <NodeAccessView />
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
