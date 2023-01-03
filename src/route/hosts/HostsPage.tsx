import { FC, useCallback, useEffect } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { HostDetailPage } from './HostDetailPage'
import { HostsTable } from './components/HostsTable'
import { getHosts, updateHost } from '~store/modules/hosts/actions'
import { useDispatch, useSelector } from 'react-redux'
import { hostsSelectors } from '~store/selectors'
import { Host } from '~store/types'

export const HostsPage: FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const hosts = useSelector(hostsSelectors.getHosts)

  useLinkBreadcrumb({
    title: t('breadcrumbs.hosts'),
  })

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
  } as any

  const refreshHosts = useCallback(() => {
    dispatch(getHosts.request())
  }, [dispatch])

  const onToggleDefaultness = useCallback((host: Host) => {
    dispatch(updateHost.request({ ...host, isdefault: !host.isdefault }))
  }, [dispatch])

  // on created
  useEffect(() => {
    refreshHosts()
  }, [refreshHosts])

  return (
    <Container maxWidth="xl">
      <Switch>
        {/* all hosts page */}
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <div style={titleStyle}>
                <Typography variant="h5">{t('hosts.hosts')}</Typography>
              </div>
            </Grid>
            <HostsTable
              hosts={hosts}
              onToggleDefaultness={onToggleDefaultness}
            />
          </Grid>
        </Route>

        {/* host details page */}
        <Route path={`${path}/:hostId`}>
          <HostDetailPage />
        </Route>
      </Switch>
    </Container>
  )
}
