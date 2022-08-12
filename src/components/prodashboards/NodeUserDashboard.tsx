import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import NodeAccessCard from './components/NetAdminCards/NodeAccessCard'
import ExtAccessCard from './components/NetAdminCards/ExtAccessCard'
import { ExtClientViewVpn } from './components/vpnview/components/ExtClientViewVpn'
import { NodeAccessView } from './components/NodeAccessView'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/selectors'
import { Node } from '~store/types'

export const NodeUserDashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const netData = useSelector(proSelectors.networkUserData)[netid]
  let nodes = [] as Node[]

  if (!!netData) {
    nodes = netData.nodes
  }

  useLinkBreadcrumb({
    title: t('breadcrumbs.netadmindashboard'),
  })

  if (!!nodes.length) {
    return <div>not found</div>
  }

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={5}>
              <NodeAccessCard />
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <ExtAccessCard />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/vpnview`}>
          <Grid>
            <ExtClientViewVpn />
          </Grid>
        </Route>
        <Route path={`${path}/nodeview`}>
          <Grid>
            <NodeAccessView />
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
