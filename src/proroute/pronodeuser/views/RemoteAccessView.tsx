import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { ExtClientViewVpn } from '../../../proroute/prouser/components/ExtClientViewVpn'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/selectors'
import { ExternalClient, Node } from '~store/types'
import { ExtClientEditVpn } from '../../../proroute/prouser/components/ExtClientEditVpn'
import { QrCodeViewVpn } from '../../../proroute/prouser/components/QrCodeViewVpn'

export const RemoteAccessView: React.FC = () => {
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
            <Grid item xs={12}>
              <ExtClientViewVpn vpns={vpns} clients={clients} />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/:clientid/edit`}>
          <Grid>
            <ExtClientEditVpn />
          </Grid>
        </Route>
        <Route path={`${path}/:clientid/qr`}>
          <Grid>
            <QrCodeViewVpn />
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
