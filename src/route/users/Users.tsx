import { Container, Grid, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NmLink } from '~components/index'
import { UserTable } from './components/UserTable'
import { UserCreate } from './create/UserCreate'
import { UserEdit } from './userId/UserEdit'
import { UserChangePassword } from './userId/UserChangePassword'
import { UserGroupEdit } from './userId/UserGroupEdit'
import { Sync } from '@mui/icons-material'

export const Users: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const history = useHistory()

  const syncUsers = () => {
    history.push('/users')
  }

  useLinkBreadcrumb({
    title: t('breadcrumbs.users'),
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              display={'flex'}
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item xs={5}>
                <h2>{t('users.header')}</h2>
              </Grid>
              <Grid item xs={1}>
                <Tooltip title={`${t('pro.refresh')}`} placement="top">
                  <IconButton color="primary" onClick={syncUsers}>
                    <Sync />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={1.5}>
                <NmLink variant="contained" to={{ pathname: '/users/create' }}>
                  {t('users.create.button')}
                </NmLink>
              </Grid>

              <Grid item xs={1.5}>
                <NmLink
                  variant="contained"
                  color="primary"
                  to={{ pathname: '/usergroups' }}
                >
                  {t('pro.label.usergroups')}
                </NmLink>
              </Grid>
              <Grid item xs={2}>
                <NmLink
                  variant="contained"
                  color="primary"
                  to={{ pathname: '/networkusers' }}
                >
                  {t('pro.label.userpermissions')}
                </NmLink>
              </Grid>
            </Grid>
          </Grid>
          <UserTable />
        </Route>
        <Route exact path={`${path}/:username/groups`}>
          <UserGroupEdit />
        </Route>
        <Route path={`${path}/create`}>
          <UserCreate />
        </Route>
        <Route path={`${path}/:username`}>
          <UserEdit />
          <UserChangePassword />
        </Route>
      </Switch>
    </Container>
  )
}
