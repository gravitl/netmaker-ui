import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NmLink } from '~components/index'
import { UserTable } from './components/UserTable'
import { UserCreate } from './create/UserCreate'

export const Users: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.users'),
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <h2>{t('users.users')}</h2>
            </Grid>
            <Grid item>
              <NmLink variant='contained' to={{ pathname: '/users/create' }}>
                {t('users.create')}
              </NmLink>
            </Grid>
          </Grid>
          <UserTable />
        </Route>
        <Route path={`${path}/create`}>
          <UserCreate />
        </Route>
        <Route path={`${path}/:networkId`}>
        </Route>
      </Switch>
    </Container>
  )
}
