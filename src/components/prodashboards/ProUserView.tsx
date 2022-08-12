import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { ProNetworkSelect } from './components/ProNetworkSelect'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/types'
import Loading from '~components/Loading'
import NetUserView from './components/NetUserView'
import { ExtClientViewVpn } from './components/vpnview/components/ExtClientViewVpn'

export const ProUserView: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const isLoading = useSelector(proSelectors.isProcessing)

  useLinkBreadcrumb({
    title: t('breadcrumbs.userdashboard'),
  })

  if (isLoading) return <Loading />

  return (
    <Container>
      <Switch>
        <Route exact path={`${path}`}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={8}>
              <ProNetworkSelect />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/:netid`}>
          <NetUserView />
        </Route>
        <Route path={`${path}/ext/:netid`}>
          <ExtClientViewVpn />
        </Route>
      </Switch>
    </Container>
  )
}
