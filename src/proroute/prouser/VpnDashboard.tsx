import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import ExtAccessCard from '../proaccessleveldashboards/components/ExtAccessCard'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/selectors'
import { ExternalClient } from '~store/types'
import { RemoteAccessView } from '../pronodeuser/views/RemoteAccessView'

export const VpnDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const netData = useSelector(proSelectors.networkUserData)[netid]
  let clients = [] as ExternalClient[]

  if (!!netData) {
    clients = netData.clients
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
            <RemoteAccessView />
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
