import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import NetworkCard from '~components/dashboard/NetworkCard'
import NodeCard from '~components/dashboard/NodeCard'
import ExtClientsCard from '~components/dashboard/ExtClientsCard'
import AccessKeysCard from '~components/dashboard/AccessKeyCard'

import { useSelector } from 'react-redux'
import { authSelectors } from '~store/types'

export const NetAdminDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const user = useSelector(authSelectors.getUser)

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
            {user?.isAdmin && (
              <>
                <Grid item xs={12} sm={6} md={3.75}>
                  <NetworkCard />
                </Grid>
                <Grid item xs={12} sm={6} md={3.75}>
                  <NodeCard />
                </Grid>

                <Grid item xs={12} sm={6} md={3.75}>
                  <AccessKeysCard />
                </Grid>
                <Grid item xs={12} sm={6} md={3.75}>
                  <ExtClientsCard />
                </Grid>
              </>
            )}
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
