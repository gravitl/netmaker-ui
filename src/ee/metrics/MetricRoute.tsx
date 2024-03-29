import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NetworkSelect } from '~components/NetworkSelect'
import { MetricsTable } from './views/MetricsTable'
import { NodeMetrics } from './views/NodeMetrics'
import { ExtMetrics } from './views/ExtMetrics'

export const MetricRoute: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('pro.metrics'),
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
            <Grid item xs={6.5}>
              <div style={titleStyle}>
                <Typography variant="h5">{t('pro.metrics')}</Typography>
              </div>
            </Grid>
            <Grid item xs={6}>
              <NetworkSelect selectAll />
            </Grid>
            <Grid item xs={12}>
              <hr />
            </Grid>
          </Grid>
        </Route>
        <Route exact path={`/ec/metrics/:netid`}>
          <ExtMetrics />
        </Route>
        <Route path={`${path}/:netid/:nodeid`}>
          <NodeMetrics />
        </Route>
        <Route path={`${path}/:netid`}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={6}>
              <NetworkSelect selectAll />
            </Grid>
            <Grid item xs={12}>
              <hr />
            </Grid>
            <Grid item xs={11.5}>
              <MetricsTable />
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
