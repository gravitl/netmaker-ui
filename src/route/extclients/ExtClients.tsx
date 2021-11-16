import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
// import { NetworkCreate } from './create/NetworkCreate'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NetworkSelect } from './components/NetworkSelect'
import { ExtClientView } from './components/ExtClientView'
import { QrCodeView } from './components/QrCodeView'
import { ExtClientEdit } from './components/ExtClientEdit'

export const ExtClients: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.extClients'),
  })

  const titleStyle = {
    textAlign: 'center',
  } as any

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
                  {t('extclient.extclients')}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <NetworkSelect />
        </Route>
        <Route path={`${path}/:netid/:clientid/qr`}>
          <QrCodeView />
        </Route>
        <Route path={`${path}/:netid/:clientid/edit`}>
          <ExtClientEdit />
        </Route>
        <Route path={`${path}/:netid`}>
          <ExtClientView />
        </Route>
      </Switch>
    </Container>
  )
}
