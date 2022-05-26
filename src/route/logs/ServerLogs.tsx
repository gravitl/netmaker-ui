import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useSelector, useDispatch } from 'react-redux'
import { serverSelectors } from '~store/selectors'
import { LinearProgress } from '@mui/material'
import { getServerLogs } from '~store/modules/server/actions'

export const ServerLogs: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const isFetching = useSelector(serverSelectors.isFetchingServerConfig)
  const serverLogs = useSelector(serverSelectors.getServerLogs)
  const [currentLogs, setCurrentLogs] = React.useState([] as string[])
  const dispatch = useDispatch()

  useLinkBreadcrumb({
    link: url,
    title: t('pro.logs'),
  })

  const titleStyle = {
    textAlign: 'center',
  } as any

  React.useEffect(() => {
      if (!!!currentLogs.length) {
        dispatch(getServerLogs.request())
      } 
      if (currentLogs.length !== serverLogs.length || currentLogs !== serverLogs) {
          setCurrentLogs(serverLogs)
      }
  }, [dispatch, currentLogs, serverLogs])

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
                  {t('pro.logs')}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
                {isFetching && <LinearProgress />}
                {currentLogs.map(log => <Typography variant='body2'>
                    {log}
                </Typography>)}
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
