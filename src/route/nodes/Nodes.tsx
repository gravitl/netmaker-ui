import { Container, Grid } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NodeTable } from './components/NodeTable'
import { NetworkSelect } from '../../components/NetworkSelect'

export const Nodes: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid container justifyContent='space-between' alignItems='center'>
            <Grid item xs={4}>
            <h2>{t('node.nodes')}</h2>
            </Grid>
            <Grid item xs={6}>
              <NetworkSelect base='networks' extension='nodes'/>
            </Grid>
          </Grid>
          <NodeTable />
        </Route>
      </Switch>
    </Container>
  )
}
