import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import NetworkCard from '~components/dashboard/NetworkCard'
import NodeCard from '~components/dashboard/NodeCard'
import ExtClientsCard from '~components/dashboard/ExtClientsCard'
import AccessKeysCard from '~components/dashboard/AccessKeyCard'

export const NetAdminDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

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
              <NetworkCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <NodeCard />
            </Grid>

            <Grid item xs={12} sm={6} md={5}>
              <AccessKeysCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <ExtClientsCard />
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
