import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/selectors'
import { Node } from '~store/types'
import { NodeAccessView } from './NodeAccessView'
import { NET_ADMIN_ACCESS_LVL } from '../../proutils/ProConsts'
import { ProNodeId } from './ProNodeId'
import { NotFound } from '~util/errorpage'
import { ProNodeEdit } from './ProNodeEdit'

export const ProNodesView: React.FC = () => {
  const { path } = useRouteMatch()
  const { netid } = useParams<{ netid: string }>()
  const netData = useSelector(proSelectors.networkUserData)[netid]
  let nodes = [] as Node[]

  if (!!netData) {
    nodes = netData.nodes
  } else {
    return <NotFound />
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
            <Grid item xs={12}>
              <NodeAccessView
                nodes={nodes}
                isNetAdmin={
                  netData.user &&
                  netData.user.accesslevel === NET_ADMIN_ACCESS_LVL
                }
              />
            </Grid>
          </Grid>
        </Route>
        <Route path={`${path}/view/:nodeid`}>
          <Grid>
            <ProNodeId />
          </Grid>
        </Route>
        {netData.user.accesslevel === NET_ADMIN_ACCESS_LVL && (
          <Route path={`${path}/edit/:nodeid`}>
            <Grid>
              <ProNodeEdit />
            </Grid>
          </Route>
        )}
      </Switch>
    </Container>
  )
}
