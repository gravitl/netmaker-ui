import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NetworkSelect } from '~components/NetworkSelect'
import { NetworkUsersTable } from './components/NetworkUsersTable'
import { NetworkUserEdit } from './components/NetworkUserEdit'
import { UserGroupEdit } from './components/UserGroupEdit'

export const NetworkUsers: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('pro.label.networkusers'),
  })

  const titleStyle = {
    textAlign: 'center',
  } as any

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
            <Grid item xs={5}>
              <div style={titleStyle}>
                <Typography variant="h5">
                  {t('pro.label.networkusers')}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={8}>
              <NetworkSelect selectAll />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/:netid/:clientid/groups`}>
          <UserGroupEdit />
        </Route>
        <Route path={`${path}/:netid/:clientid`}>
          <NetworkUserEdit />
        </Route>
        <Route path={`${path}/:netid`}>
          <NetworkUsersTable />
        </Route>
      </Switch>
    </Container>
  )
}
