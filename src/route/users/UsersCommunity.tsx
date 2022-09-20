import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NmLink } from '~components/index'
import { UserTableCommunity } from './components/UserTableCommunity'
import { UserCreate } from './create/UserCreate'
import { UserEditCommunity } from './userId/UserEditCommunity'
import { UserChangePassword } from './userId/UserChangePassword'

export const UsersCommunity: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.users'),
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid item xs={10}>
            <Grid
              container
              direction="row"
              display={'flex'}
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item xs={9}>
                <h2>{t('users.header')}</h2>
              </Grid>
              <Grid item xs={2}>
                <NmLink fullWidth variant="contained" to={{ pathname: '/users/create' }}>
                  {t('users.create.button')}
                </NmLink>
              </Grid>
            </Grid>
          </Grid>
          <UserTableCommunity />
        </Route>
        <Route path={`${path}/create`}>
          <UserCreate />
        </Route>
        <Route path={`${path}/:username`}>
          <UserEditCommunity />
          <UserChangePassword />
        </Route>
      </Switch>
    </Container>
  )
}
