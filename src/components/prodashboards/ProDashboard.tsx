import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { ProNetworkSelect } from './NetAdminDashboard/ProNetworkSelect'
import { ProAccessLvl } from './NetAdminDashboard/ProAccessLevel'

export const ProDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.userdashboard'),
  })

  return (
    <Container>
      <Switch>
        <Route exact path={`${path}/accesslvl`}>
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

        <Route path={`${path}/accesslvl/:netid`}>
          <ProAccessLvl />
        </Route>
      </Switch>
    </Container>
  )
}
