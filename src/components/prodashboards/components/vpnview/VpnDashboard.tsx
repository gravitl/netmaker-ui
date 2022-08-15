import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import ExtAccessCard from '../NetAdminCards/ExtAccessCard'
import { ExtClientViewVpn } from './components/ExtClientViewVpn'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/selectors'
import { ExternalClient, Node } from '~store/types'

export const VpnDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const netData = useSelector(proSelectors.networkUserData)[netid]
  let clients = [] as ExternalClient[]
  let vpns = [] as Node[]

  if (!!netData) {
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
              <ExtAccessCard clients={clients} />
            </Grid>
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
