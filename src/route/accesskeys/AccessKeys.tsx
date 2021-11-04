import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
// import { NetworkCreate } from './create/NetworkCreate'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { AccessKeySelect } from './components/AccessKeySelect'
import { NetworkAccessKeys } from './components/NetworkAccessKeys'

export const AccessKeys: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.accessKeys'),
  })

  const titleStyle = {
    textAlign: 'center'
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
                <Typography variant='h4'>
                    {t('accesskey.accesskeys')}
                </Typography>
            </div>
            </Grid>
          </Grid>
          <AccessKeySelect />
        </Route>
        <Route path={`${path}/:netid`}>
            <NetworkAccessKeys />
        </Route>
        <Route path={`${path}/:netid/create`}>
            <><h2>{t('accesskey.create')}</h2></>
        </Route>
      </Switch>
    </Container>
  )
}
