import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { ProNetworkSelect } from './components/ProNetworkSelect'
import { ProAccessLvl } from './components/ProAccessLevel'
import { NetAdminDashboard } from './components/NetAdminDashboard'

export const ProUserView: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.userdashboard'),
  })

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
          <ProAccessLvl />
        </Route>
        <Route path={`${path}/:netid/:accesslvl`}>
          <NetAdminDashboard />
        </Route>
      </Switch>
    </Container>
  )
}
