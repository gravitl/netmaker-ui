import { Container, Grid, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { authSelectors } from '~store/selectors'
import { getNodes } from '~store/modules/node/actions'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NodeTable } from './components/NodeTable'
import { NetworkSelect } from '../../components/NetworkSelect'
import { Sync } from '@mui/icons-material'

export const Nodes: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const token = useSelector(authSelectors.getToken)
  const dispatch = useDispatch()

  const syncNodes = () => {
    if (token) {
      dispatch(getNodes.request({ token }))
    }
  }

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={4}>
              <h2>{t('node.nodes')}</h2>
            </Grid>
            <Grid item xs={6}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={8}>
                  <NetworkSelect base="networks" extension="nodes" />
                </Grid>
                <Grid item xs={3}>
                  <Tooltip title={t('node.sync') as string} placement="top">
                    <IconButton color="primary" onClick={syncNodes}>
                      <Sync />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <NodeTable />
        </Route>
      </Switch>
    </Container>
  )
}
