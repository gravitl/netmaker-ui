import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NetworkSelect } from '~components/NetworkSelect'
// import { NetworkGraph } from './components/NetworkGraph'
import { NetworkGraph } from './components/NetworkGraph'

export const Graphs: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.graphs'),
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
                  {t('network.graphs')}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <NetworkSelect selectAll />
        </Route>
        <Route path={`${path}/:netid`}>
          <NetworkGraph />
        </Route>
      </Switch>
    </Container>
  )
}
