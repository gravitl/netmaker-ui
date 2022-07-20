import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NmLink } from '~components/index'
import { UserGroupsTable } from './table/UserGroupsTable'
import { UserGroupCreate } from './create/UserGroupCreate'

export const UserGroups: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('pro.label.usergroups'),
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            display={'flex'}
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item xs={7}>
              <Typography variant='h4'>{t('pro.label.usergroups')}</Typography>
            </Grid>
            <Grid item xs={2}>
              <NmLink fullWidth variant="contained" to={{ pathname: '/usergroups/create' }}>
                {`${t('common.create')} ${t('pro.label.usergroup')}`}
              </NmLink>
            </Grid>
            <Grid item xs={10}>
              <UserGroupsTable />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/create`}>
          <UserGroupCreate />
        </Route>
      </Switch>
    </Container>
  )
}
