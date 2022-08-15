import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import ProAccessKeyCard from './NetAdminCards/ProAccessKeyCard'
import AdminNetworkCard from './NetAdminCards/AdminNetwork'
import { ProNetworks } from '../networksView/ProNetworks'
import { NodeAccessView } from './NodeAccessView'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/types'
import { useParams } from 'react-router-dom'
import { ExternalClient, Node } from '~store/types'
import NodeAccessCard from './NetAdminCards/NodeAccessCard'
import { ExtClientViewVpn } from './vpnview/components/ExtClientViewVpn'
import ExtAccessCard from './NetAdminCards/ExtAccessCard'
import { ProDashboardAccessKeys } from '../proaccesskeys/ProDashboardAccessKeys'

export const NetAdminDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const netData = useSelector(proSelectors.networkUserData)[netid]
  let nodes = [] as Node[]
  let clients = [] as ExternalClient[]
  let vpns = [] as Node[]

  if (!!netData) {
    nodes = netData.nodes
    clients = netData.clients
    vpns = netData.vpns
  }

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
              <AdminNetworkCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <NodeAccessCard nodes={nodes} />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <ProAccessKeyCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <ExtAccessCard clients={clients} />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/proedit`}>
          <Grid>
            <ProNetworks />
          </Grid>
        </Route>
        <Route path={`${path}/nodeview`}>
          <Grid>
            <NodeAccessView nodes={nodes} />
          </Grid>
        </Route>
        <Route path={`${path}/accesskeys`}>
          <Grid>
            <ProDashboardAccessKeys />
          </Grid>
        </Route>
        <Route path={`${path}/vpnview`}>
          <Grid>
            <ExtClientViewVpn vpns={vpns} clients={clients} />
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
