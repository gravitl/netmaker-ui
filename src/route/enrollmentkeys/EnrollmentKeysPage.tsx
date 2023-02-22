import { Grid, Typography, Container } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { hostsSelectors } from '~store/selectors'
import { HostsTable } from '../hosts/components/HostsTable'

export const EnrollmentKeysPage: FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const hosts = useSelector(hostsSelectors.getHosts)

  useLinkBreadcrumb({
    title: t('common.enrollmentkeys'),
  })

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
  } as any
  
  return (
    <Container>
      <Switch>
        {/* all keys page */}
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <div style={titleStyle}>
                <Typography variant="h5">{t('common.enrollmentkeys')}</Typography>
              </div>
            </Grid>
            {/* // <HostsTable
            //   hosts={hosts}
            //   onToggleDefaultness={onToggleDefaultness}
            // /> */}
          </Grid>
        </Route>

        {/* modals */}
        {/* <Route path={`${path}/:hostId`}>
          <HostDetailPage />
        </Route> */}
      </Switch>
    </Container>
  )
}
