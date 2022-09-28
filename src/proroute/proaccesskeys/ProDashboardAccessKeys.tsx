import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '../proutils/PathBreadcrumbs'
import { ProAccessKeyCreate } from './components/ProAccessKeyCreate'
import { ProAccessKeyTable } from './components/ProAccessKeyTable'
import { ProAccessKeyView } from './components/ProAccessKeyView'

export const ProDashboardAccessKeys: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.accessKeys'),
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={8}>
              <ProAccessKeyTable />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/create`}>
          <ProAccessKeyCreate />
        </Route>
        <Route path={`${path}/view/:keyname`}>
          <ProAccessKeyView />
        </Route>
      </Switch>
    </Container>
  )
}
