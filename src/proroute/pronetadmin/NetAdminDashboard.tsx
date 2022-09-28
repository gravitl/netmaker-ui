import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '../proutils/PathBreadcrumbs'
import ProAccessKeyCard from '../proaccessleveldashboards/components/ProAccessKeyCard'
import AdminNetworkCard from '../proaccessleveldashboards/components/AdminNetwork'
import { useSelector } from 'react-redux'
import { Network, proSelectors } from '~store/types'
import { useParams } from 'react-router-dom'
import { ExternalClient } from '~store/types'
import NodeAccessCard from '../proaccessleveldashboards/components/NodeAccessCard'
import ExtAccessCard from '../proaccessleveldashboards/components/ExtAccessCard'
import { ProDashboardAccessKeys } from '../proaccesskeys/ProDashboardAccessKeys'
import { ProNetworkEdit } from './components/ProNetworkEdit'
import { RemoteAccessView } from '../pronodeuser/views/RemoteAccessView'
import { ProNodesView } from '../pronodeuser/components/ProNodesView'

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
