import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { ProAccessKeyCreate } from './components/ProAccessKeyCreate'
import { ProAccessKeyTable } from './components/ProAccessKeyTable'

export const ProDashboardAccessKeys: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.accessKeys'),
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
                  {t('accesskey.accesskeys')}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={8}>
              <ProAccessKeyTable />
            </Grid>
          </Grid>
        </Route>

        <Route path={`${path}/create`}>
          <ProAccessKeyCreate />
        </Route>
      </Switch>
    </Container>
  )
}
