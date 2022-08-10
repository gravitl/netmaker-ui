import { Container } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
// import { NetworkCreate } from './create/NetworkCreate'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { ExtClientViewVpn } from './components/ExtClientViewVpn'
import { QrCodeViewVpn } from './components/QrCodeViewVpn'
import { ExtClientEditVpn } from './components/ExtClientEditVpn'

export const ExtClients: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    title: t('breadcrumbs.extClients'),
  })

  

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <ExtClientViewVpn />
        </Route>
        <Route path={`${path}/:netid/:clientid/qr`}>
          <QrCodeViewVpn />
        </Route>
        <Route path={`${path}/:netid/:clientid/edit`}>
          <ExtClientEditVpn />
        </Route>
      </Switch>
    </Container>
  )
}
