import {
  Button,
  Grid,
  TextField,
  Switch as SwitchField,
  FormControlLabel,
  Typography,
} from '@mui/material'
import React, { useCallback } from 'react'
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
import { NetworkNodes } from './nodes/NetworkNodes'
import { useNetwork } from '~util/network'

export const NetworkId: React.FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()

  const { netid } = useParams<{ netid: string }>()
  const network = useNetwork(netid)

  useLinkBreadcrumb({
    link: url,
    title: netid,
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

  const buttonStyle = {
    width: '100%',
    margin: '4px',
    height: '100%',
    flex: '1',
    inlineSize: '1em', 
    overflow: 'hidden',
  } as any

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
          {/* <NetworkModifiedStats netid={netid} /> */}
          <NetworkEdit
            network={network}
            onCancel={() => {
              history.push(
                url.replace(':netid', network.netid).replace('/edit', '')
              )
            }}
          />
        </Route>
        <Route exact path={path}>
          <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
            <Typography variant="h5" style={{overflowWrap: 'break-word'}}>
              {`${t('network.details')} : ${netid}`}
            </Typography>
          </div>
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            style={{ marginBottom: '2em', marginTop: '2em' }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5em 0 0.5em 0'}}>
                <NmLink to={`${url}/edit`} variant="outlined" fullWidth style={buttonStyle}>
                  {t('common.edit')}
                </NmLink>
                <NmLink to={`/nodes/${netid}`} variant="outlined" fullWidth style={buttonStyle}>
                  {`${t('node.nodes')}`}
                </NmLink>
                <NmLink to={`/access-keys/${netid}`} variant="outlined" fullWidth style={buttonStyle}>
                  {t('header.accessKeys')}
                </NmLink>
                <Button
                  variant="outlined"
                  onClick={() => deleteNetworkCallback()}
                  fullWidth
                  color='warning'
                  style={buttonStyle}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} sm={2}>
              <div style={{textAlign: 'center', margin: '0.5em 0 0.5em 0'}}>
                
              </div>
            </Grid>
            <Grid item xs={12} sm={2}>
            <div style={{textAlign: 'center', margin: '0.5em 0 0.5em 0'}}>
                
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              '& .MuiTextField-root': { margin: '4px' },
              marginBottom: '2em',
            }}
            justifyContent="space-around"
            alignItems="center"
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
        </Route>
      </Switch>
      <Component />
    </>
  )
}
