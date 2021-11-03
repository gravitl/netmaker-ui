import {
  Button,
  Grid,
  TextField,
  Switch as SwitchField,
  FormControlLabel,
} from '@mui/material'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  useRouteMatch,
  useHistory,
  useParams,
  Switch,
  Route,
} from 'react-router-dom'
import { NmLink } from '~components/index'
import { useDialog } from '~components/ConfirmDialog'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { deleteNetwork } from '~modules/network/actions'
import { NetworkEdit } from './edit/NetworkEdit'
import { AccessKeys } from './accesskeys/AccessKeys'
import { NetworkModifiedStats } from './components/NetworkModifiedStats'
import { NetworkNodes } from './nodes/NetworkNodes'
import { useNetwork } from '~util/network'

export const NetworkId: React.FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()

  const { networkId } = useParams<{ networkId: string }>()
  const network = useNetwork(networkId)

  useLinkBreadcrumb({
    link: url,
    title: networkId,
  })

  const { Component, setProps } = useDialog()

  const dispatch = useDispatch()
  const deleteNetworkCallback = useCallback(
    () =>
      setProps({
        message: t('dialog.deleteNetwork'),
        onSubmit: () =>
          dispatch(
            deleteNetwork.request({
              netid: network!.netid,
            })
          ),
      }),
    [dispatch, network, setProps, t]
  )

  if (!network) {
    return <div>Not Found</div>
  }

  return (
    <>
      <Switch>
        <Route path={`${path}/accesskeys`}>
          <AccessKeys />
        </Route>
        <Route path={`${path}/nodes`}>
          <NetworkNodes />
        </Route>
        <Route path={`${path}/edit`}>
          <NetworkModifiedStats netid={networkId} />
          <NetworkEdit
            network={network}
            onCancel={() => {
              history.push(
                url.replace(':networkId', network.netid).replace('/edit', '')
              )
            }}
          />
        </Route>
        <Route exact path={path}>
          <NetworkModifiedStats netid={networkId} />
          <Grid
            container
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
          >
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                disabled
                value={network.addressrange}
                label={t('network.addressrange')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.addressrange6}
                label={t('network.addressrange6')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.localrange}
                label={t('network.localrange')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.displayname}
                label={t('network.displayname')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultinterface}
                label={t('network.defaultinterface')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultlistenport}
                label={t('network.defaultlistenport')}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultpostup}
                label={t('network.defaultpostup')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultpostdown}
                label={t('network.defaultpostdown')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultkeepalive}
                label={t('network.defaultkeepalive')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.checkininterval}
                label={t('network.checkininterval')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultextclientdns}
                label={t('network.defaultextclientdns')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultmtu}
                label={t('network.defaultmtu')}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                label={t('network.allowmanualsignup')}
                control={
                  <SwitchField checked={network.allowmanualsignup} disabled />
                }
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                label={t('network.isdualstack')}
                control={<SwitchField checked={network.isdualstack} disabled />}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                label={t('network.defaultsaveconfig')}
                control={
                  <SwitchField checked={network.defaultsaveconfig} disabled />
                }
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                label={t('network.defaultudpholepunch')}
                control={
                  <SwitchField checked={network.defaultudpholepunch} disabled />
                }
                disabled
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-around"
            alignItems="center"
            style={{ marginBottom: '2em' }}
          >
            <Grid item xs={6} sm={3}>
              <NmLink to={`${url}/edit`} variant="outlined">
                {t('common.edit')}
              </NmLink>
            </Grid>
            <Grid item xs={6} sm={3}>
              <NmLink to={`${url}/nodes`} variant="outlined">
                {`${t('node.nodes')}`}
              </NmLink>
            </Grid>
            <Grid item xs={6} sm={3}>
              <NmLink to={`${url}/accesskeys`} variant="outlined">
                {t('header.accessKeys')}
              </NmLink>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                onClick={() => deleteNetworkCallback()}
              >
                {t('common.delete')}
              </Button>
            </Grid>
          </Grid>
        </Route>
      </Switch>
      <Component />
    </>
  )
}
