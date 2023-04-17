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
import { useDispatch, useSelector } from 'react-redux'
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
import { useNetwork } from '~util/network'
import { NotFound } from '~util/errorpage'
import { NetworkListEdit } from './edit/NetworkListEdit'
import { serverSelectors } from '~store/selectors'

export const NetworkId: React.FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const network = useNetwork(netid)
  const serverConfig = useSelector(serverSelectors.getServerConfig)

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

  if (!!!network) {
    return (
      <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
        <Typography variant="h5">
          <NotFound />
        </Typography>
      </div>
    )
  }

  const hasProSettings = !!network?.prosettings

  const buttonStyle = {
    width: '100%',
    margin: '4px',
    height: '100%',
    flex: '1',
    inlineSize: '1em',
    overflow: 'hidden',
  } as any

  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as any

  return (
    <>
      <Switch>
        <Route path={`${path}/edit/networkusers`}>
          <NetworkListEdit netid={netid} field='users' />
        </Route>
        <Route path={`${path}/edit/groups`}>
          <NetworkListEdit netid={netid} field='groups' />
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
            <Typography variant="h5" style={{ overflowWrap: 'break-word' }}>
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '0.5em 0 0.5em 0',
                }}
              >
                <NmLink
                  to={`${url}/edit`}
                  variant="outlined"
                  fullWidth
                  style={buttonStyle}
                >
                  {t('common.edit')}
                </NmLink>
                <NmLink
                  to={`/nodes/${netid}`}
                  variant="outlined"
                  fullWidth
                  style={buttonStyle}
                >
                  {`${t('node.nodes')}`}
                </NmLink>
                <NmLink
                  to={`/graphs/${netid}`}
                  variant="outlined"
                  fullWidth
                  style={buttonStyle}
                >
                  {t('network.graph')}
                </NmLink>
                <NmLink
                  to={`/acls/${netid}`}
                  variant="outlined"
                  fullWidth
                  style={buttonStyle}
                >
                  {t('header.acls')}
                </NmLink>
                <Button
                  variant="outlined"
                  onClick={() => deleteNetworkCallback()}
                  fullWidth
                  color="warning"
                  style={buttonStyle}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} sm={2}>
              <div
                style={{ textAlign: 'center', margin: '0.5em 0 0.5em 0' }}
              ></div>
            </Grid>
            <Grid item xs={12} sm={2}>
              <div
                style={{ textAlign: 'center', margin: '0.5em 0 0.5em 0' }}
              ></div>
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
                label={String(t('network.addressrange'))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.addressrange6}
                label={String(t('network.addressrange6'))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultinterface}
                label={String(t('network.defaultinterface'))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultlistenport}
                label={String(t('network.defaultlistenport'))}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultpostup}
                label={String(t('network.defaultpostup'))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultpostdown}
                label={String(t('network.defaultpostdown'))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultkeepalive}
                label={String(t('network.defaultkeepalive'))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultextclientdns}
                label={String(t('network.defaultextclientdns'))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                disabled
                value={network.defaultmtu}
                label={String(t('network.defaultmtu'))}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div style={centerStyle}>
                <FormControlLabel
                  label={String(t('network.isipv4'))}
                  control={<SwitchField checked={network.isipv4} disabled />}
                  disabled
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div style={centerStyle}>
                <FormControlLabel
                  label={String(t('network.isipv6'))}
                  control={<SwitchField checked={network.isipv6} disabled />}
                  disabled
                />
              </div>
            </Grid>
            {/* <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                label={String(t('network.allowmanualsignup'))}
                control={
                  <SwitchField checked={network.allowmanualsignup} disabled />
                }
                disabled
              />
            </Grid> */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                label={String(t('network.defaultudpholepunch'))}
                control={
                  <SwitchField checked={network.defaultudpholepunch} disabled />
                }
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                label={String(t('network.defaultacl'))}
                control={<SwitchField checked={network.defaultacl} disabled />}
                disabled
              />
            </Grid>
            { serverConfig.IsEE && <>
            <Grid item xs={12} style={{marginTop: '1rem'}}></Grid>
            <Grid item xs={12} sm={4} md={3.1}>
              <TextField
                disabled
                value={hasProSettings ? network.prosettings?.defaultaccesslevel : 2}
                label={String(t('pro.network.defaultaccesslevel'))}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3.1}>
              <TextField
                disabled
                value={hasProSettings ? network.prosettings?.defaultusernodelimit : 0}
                label={String(t('pro.network.defaultusernodelimit'))}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3.1}>
              <TextField
                disabled
                value={hasProSettings ? network.prosettings?.defaultuserclientlimit : 0}
                label={String(t('pro.network.defaultuserclientlimit'))}
                type="number"
              />
            </Grid>
            <Grid item xs={12} style={{marginTop: '1rem'}}></Grid>
            <Grid item xs={12} sm={5} md={5} style={centerStyle}>
              <TextField
                fullWidth
                disabled
                value={hasProSettings ? network.prosettings?.allowedgroups.join(',') : ''}
                label={String(t('pro.network.allowedgroups'))}
              />
            </Grid>
            <Grid item xs={12} sm={5} md={5} style={centerStyle}>
              <TextField
                fullWidth
                disabled
                value={hasProSettings ? network.prosettings?.allowedusers.join(',') : ''}
                label={String(t('pro.network.allowedusers'))}
              />
            </Grid>
            </>
            }
          </Grid>
        </Route>
      </Switch>
      <Component />
    </>
  )
}
