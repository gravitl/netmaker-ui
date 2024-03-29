import {
  Container,
  Grid,
  IconButton,
  Typography,
  InputAdornment,
  TextField,
  Paper,
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
import { authSelectors } from '~store/selectors'
import { MAX_ATTEMPTS } from '~components/utils'

export const ServerLogs: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const isFetching = useSelector(serverSelectors.isFetchingServerConfig)
  const serverLogs = useSelector(serverSelectors.getServerLogs)
  const [currentLogs, setCurrentLogs] = React.useState([] as string[])
  const dispatch = useDispatch()
  const [filterLogs, setFilterLogs] = React.useState(serverLogs)
  const inDarkMode = useSelector(authSelectors.isInDarkMode)
  const attempts = useSelector(serverSelectors.getAttempts)

  useLinkBreadcrumb({
    link: url,
    title: t('pro.logs'),
  })

  const refreshLogs = () => {
    setCurrentLogs([])
  }

  React.useEffect(() => {
    if (!!!currentLogs.length && !isFetching) {
      if (attempts < MAX_ATTEMPTS)
      dispatch(getServerLogs.request())
    }
    if (
      currentLogs.length !== serverLogs.length ||
      currentLogs !== serverLogs
    ) {
      setCurrentLogs(serverLogs)
    }
  }, [dispatch, currentLogs, serverLogs, isFetching, attempts])

  const handleFilter = (event: { target: { value: string } }) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterLogs(serverLogs)
    } else {
      setFilterLogs(
        serverLogs.filter((log) =>
          log.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }

  const showlogs =
    filterLogs.length && filterLogs.length < currentLogs.length
      ? filterLogs
      : currentLogs

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item xs={4}>
              <Typography variant='h3'>
                {t('pro.logs')}
              </Typography>
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
                  <Tooltip title={`${t('pro.refresh')}`} placement="top">
                    <IconButton color="primary" onClick={refreshLogs}>
                      <Sync />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" alignItems="center">
            <Grid
              item
              xs={11}
              style={{ backgroundColor: inDarkMode ? '#272727' : '' }}
            >
              <Paper style={{ maxHeight: '50vh', overflow: 'auto' }}>
                {attempts >= MAX_ATTEMPTS && <Typography color="red">{t('error.overload')}</Typography> }
                {isFetching && <LinearProgress />}
                {showlogs.map((log, i) => (
                  <Typography variant="body2" key={i}>{log}</Typography>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
