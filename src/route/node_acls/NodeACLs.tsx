import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NetworkSelect } from '~components/NetworkSelect'
import { NodesACLTable } from './components/NodesACLTable'

export const NodeAcls: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    link: url,
    title: t('breadcrumbs.acls'),
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
                  {t('acls.nodes')}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <NetworkSelect selectAll />
        </Route>
        <Route path={`${path}/:netid/:nodeid`}>
          <NodesACLTable />
        </Route>
        <Route path={`${path}/:netid`}>
          <NodesACLTable />
        </Route>
      </Switch>
    </Container>
  )
}
