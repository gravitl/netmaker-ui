import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import NodeAccessCard from '../components/NetAdminCards/NodeAccessCard'
import ExtAccessCard from '../components/NetAdminCards/ExtAccessCard'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/selectors'
import { ExternalClient } from '~store/types'
import { RemoteAccessView } from '../components/vpnview/RemoteAccessView'
import { ProNodesView } from '../components/nodes/ProNodesView'

export const NodeUserDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const netData = useSelector(proSelectors.networkUserData)[netid]
  let clients = [] as ExternalClient[]

  if (!!netData) {
    clients = netData.clients
  }

  useLinkBreadcrumb({
    title: t('breadcrumbs.nodeuserdashboard'),
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
              <ExtAccessCard clients={clients} />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/vpnview`}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <RemoteAccessView />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/nodeview`}>
          <Grid>
            <ProNodesView />
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
