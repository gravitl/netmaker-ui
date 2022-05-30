import {
  Container,
  Grid,
  IconButton,
  Typography,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useSelector, useDispatch } from 'react-redux'
import { serverSelectors } from '~store/selectors'
import { LinearProgress } from '@mui/material'
import { getServerLogs } from '~store/modules/server/actions'
import { Search, Sync } from '@mui/icons-material'

export const ServerLogs: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const isFetching = useSelector(serverSelectors.isFetchingServerConfig)
  const serverLogs = useSelector(serverSelectors.getServerLogs)
  const [currentLogs, setCurrentLogs] = React.useState([] as string[])
  const dispatch = useDispatch()
  const [filterLogs, setFilterLogs] = React.useState(serverLogs)

  useLinkBreadcrumb({
    link: url,
    title: t('pro.logs'),
  })

  const refreshLogs = () => {
    setCurrentLogs([])
  }

  const titleStyle = {
    textAlign: 'center',
  } as any

  React.useEffect(() => {
    if (!!!currentLogs.length) {
      dispatch(getServerLogs.request())
    }
    if (
      currentLogs.length !== serverLogs.length ||
      currentLogs !== serverLogs
    ) {
      setCurrentLogs(serverLogs)
    }
  }, [dispatch, currentLogs, serverLogs])

  const handleFilter = (event: { target: { value: string } }) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterLogs(serverLogs)
    } else {
      setFilterLogs(serverLogs.filter((log) => log.includes(searchTerm)))
    }
  }

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item xs={4}>
                <h2>{t('pro.logs')}</h2>
            </Grid>
            <Grid item xs={6}>
            <Grid container justifyContent="space-around" alignItems="center">
              <Grid item xs={4}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  label={`${t('common.search')} ${t('pro.logs')}`}
                  onChange={handleFilter}
                />
              </Grid>
              <Grid item xs={4}>
                <IconButton color="primary" onClick={refreshLogs}>
                  <Sync />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          </Grid>
          
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={11}>
            {isFetching && <LinearProgress />}
            {currentLogs.map((log) => (
              <Typography variant="body2">{log}</Typography>
            ))}
          </Grid>
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
