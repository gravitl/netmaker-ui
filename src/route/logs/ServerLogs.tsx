import { Container, Grid, IconButton, Typography, InputAdornment, TextField, Tooltip } from '@mui/material'
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
    if (currentLogs.length !== serverLogs.length || currentLogs !== serverLogs) {
      setCurrentLogs(serverLogs)
    }
  }, [dispatch, currentLogs, serverLogs])

  const handleFilter = (event: { target: { value: string } }) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterLogs(serverLogs)
    } else {
      setFilterLogs(serverLogs.filter(log => log.includes(searchTerm)))
    }
  }


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
            <Grid item xs={4}>
              <Grid container justifyContent='space-around' alignItems='center'>
                <div style={titleStyle}>
                  <Typography variant="h5">
                    {t('pro.logs')}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={5}>
                <Grid container justifyContent='space-around' alignItems='center'>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    label={`${t('common.search')} ${t('pro.logs')}`}
                    onChange={handleFilter} />

                </Grid>
                <Grid item xs={5}>
                  <IconButton color='primary' onClick={refreshLogs}>
                    <Sync />
                  </IconButton>
                </Grid>
              </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {isFetching && <LinearProgress />}
              {currentLogs.map(log => <Typography variant='body2'>
                {log}
              </Typography>)}
            </Grid>
          
        </Route>
      </Switch>
    </Container>
  )
}
