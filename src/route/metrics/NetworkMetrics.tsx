import {
    Container,
    Grid,
  } from '@mui/material'
  import React from 'react'
  import { useRouteMatch, Switch, Route } from 'react-router-dom'
  import { useTranslation } from 'react-i18next'
  import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
  
  export const NetworkMetrics: React.FC = () => {
    const { path, url } = useRouteMatch()
    const { t } = useTranslation()

  
    useLinkBreadcrumb({
      link: url,
      title: t('pro.metrics'),
    })
  
    return (
      <Container>
        <Switch>
          <Route exact path={path}>
            <Grid container justifyContent="space-around" alignItems="center">
              <h1>Hello Metrics</h1>
            </Grid>
          </Route>
        </Switch>
      </Container>
    )
  }
  