import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import ProAccessKeyCard from '../components/NetAdminCards/ProAccessKeyCard'
import AdminNetworkCard from '../components/NetAdminCards/AdminNetwork'
import { useSelector } from 'react-redux'
import { Network, proSelectors } from '~store/types'
import { useParams } from 'react-router-dom'
import { ExternalClient } from '~store/types'
import NodeAccessCard from '../components/NetAdminCards/NodeAccessCard'
import ExtAccessCard from '../components/NetAdminCards/ExtAccessCard'
import { ProDashboardAccessKeys } from '../proaccesskeys/ProDashboardAccessKeys'
import { ProNetworkEdit } from '../networksView/pronetworkId/edit/ProNetworkEdit'
import { RemoteAccessView } from '../components/vpnview/RemoteAccessView'
import { ProNodesView } from '../components/nodes/ProNodesView'

export const NetAdminDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const netData = useSelector(proSelectors.networkUserData)[netid]
  const history = useHistory()
  let clients = [] as ExternalClient[]
  let network = {} as Network

  if (!!netData) {
    clients = netData.clients
    network = netData.networks.filter((net) => net.netid === netid)[0]
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
              <NodeAccessCard />
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
            <ProNetworkEdit
              onCancel={() => history.push(`/prouser/${netid}`)}
              network={network}
            />
          </Grid>
        </Route>
        <Route path={`${path}/nodeview`}>
          <Grid>
            <ProNodesView />
          </Grid>
        </Route>
        <Route path={`${path}/accesskeys`}>
          <Grid>
            <ProDashboardAccessKeys />
          </Grid>
        </Route>
        <Route path={`${path}/vpnview`}>
          <Grid>
            <RemoteAccessView />
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
