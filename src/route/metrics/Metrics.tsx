import {
    Container,
    Grid,
    LinearProgress,
  } from '@mui/material'
  import React from 'react'
  import { useRouteMatch, Switch, Route } from 'react-router-dom'
  import { useTranslation } from 'react-i18next'
  import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
  import { useDispatch, useSelector } from 'react-redux'
  import { serverSelectors } from '~store/selectors'
  import { getMetrics } from '~store/modules/server/actions'
import { MetricsContainer } from '~store/types'
  
  export const Metrics: React.FC = () => {
    const { path, url } = useRouteMatch()
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const metrics = useSelector(serverSelectors.getMetrics)
    const isFetching = useSelector(serverSelectors.isFetchingServerConfig)
    const [currentMetrics, setCurrentMetrics] = React.useState({} as MetricsContainer)
  
    useLinkBreadcrumb({
      link: url,
      title: t('pro.metrics'),
    })

    React.useEffect(() => {
        if (!!!Object.keys(currentMetrics).length) {
            dispatch(getMetrics.request(undefined))
        }
        if (!!metrics &&
            Object.keys(currentMetrics).length !== Object.keys(metrics).length) {
            setCurrentMetrics(metrics)
        }
    }, [dispatch, currentMetrics, metrics])
  
    return (
      <Container>
        <Switch>
          <Route exact path={path}>
            <Grid container justifyContent="space-around" alignItems="center">
              <h1>Hello Metrics</h1>
              {isFetching && <LinearProgress />}
              {!!currentMetrics && <Grid item xs={12}>
                {Object.entries(currentMetrics).map(e => !!e && !!e[0] ? <div key={e[0]}>{JSON.stringify(e)}</div> : null)}
              </Grid>}
            </Grid>
          </Route>
        </Switch>
      </Container>
    )
  }
  