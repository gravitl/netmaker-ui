import { FC, useCallback, useState } from 'react'
import {
  Button,
  Grid,
  TextField,
  Switch as SwitchField,
  FormControlLabel,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
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
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import CustomDialog from '~components/dialog/CustomDialog'
import { NotFound } from '~util/errorpage'
import { HostNetworksTable } from './components/HostNetworksTable'
import { HostEditPage } from './HostEditPage'
import {
  deleteHost,
  deleteHostRelay,
  refreshHostKeys,
} from '~store/modules/hosts/actions'
import { useGetHostById } from '~util/hosts'
import { HostRelayTable } from './components/HostRelayTable'
import { CreateRelayModal } from './components/CreateRelayModal'
import { Visibility } from '@mui/icons-material'
import copy from 'copy-to-clipboard'
import { CopyAllOutlined } from '@mui/icons-material'
import CustomizedDialogs from '~components/dialog/CustomDialog'

export const HostDetailPage: FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { hostId } = useParams<{ hostId: string }>()
  const host = useGetHostById(decodeURIComponent(hostId))
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteRelayModal, setShowDeleteRelayModal] = useState(false)
  const [pageView, setPageView] = useState<
    'details' | 'networks' | 'relay-status'
  >('details')
  const [showCreateRelayModal, setShowCreateRelayModal] = useState(false)
  const [
    shouldShowConfirmRefreshKeysModal,
    setShouldShowConfirmRefreshKeysModal,
  ] = useState(false)

  useLinkBreadcrumb({
    link: url,
    title: decodeURIComponent(hostId),
  })

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const handleCloseDeleteRelayModal = () => {
    setShowDeleteRelayModal(false)
  }

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true)
  }

  const handleOpenDeleteRelayModal = () => {
    setShowDeleteRelayModal(true)
  }

  const rowMargin = {
    margin: '1em 0 1em 0',
  }

  const handleDeleteHost = useCallback(() => {
    if (!host) return
    dispatch(
      deleteHost.request({
        hostid: host.id,
      })
    )
    history.push('/hosts')
  }, [dispatch, history, host])

  const handleDeleteRelay = useCallback(() => {
    if (!host) return
    dispatch(
      deleteHostRelay.request({
        hostid: host.id,
      })
    )
  }, [dispatch, host])

  const refreshKeys = useCallback(() => {
    if (!host) return
    dispatch(refreshHostKeys['request']({ id: host.id }))
  }, [dispatch, host])

  if (!host) {
    return <NotFound />
  }

  return (
    <Switch>
      <Route path={`${path}/edit`}>
        <HostEditPage
          onCancel={() => {
            history.push(url.replace(':hostId', host.id).replace('/edit', ''))
          }}
        />
      </Route>

      <Route exact path={path}>
        <Grid container>
          <Grid item xs={12}>
            <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
              <Typography variant="h5">
                {`${t('hosts.details')} : ${host.name}`}
              </Typography>
            </div>
          </Grid>

          {/* page view actions */}
          <Grid container item xs={12} justifyContent="center">
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <ToggleButtonGroup
                size="small"
                color="primary"
                value={pageView}
                exclusive
                onChange={(ev, value) => setPageView(value)}
                aria-label="text alignment"
              >
                <ToggleButton value="details" aria-label="left aligned">
                  Host Details
                </ToggleButton>
                <ToggleButton value="networks" aria-label="centered">
                  Networks
                </ToggleButton>
                <ToggleButton value="relay-status" aria-label="right aligned">
                  Relay Status
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          {/* host details */}
          {pageView === 'details' && (
            <>
              {/* actions row */}
              <Grid container item xs={12} sx={rowMargin} gap={2}>
                <Grid item xs={12} md={2}>
                  <NmLink fullWidth to={`${url}/edit`} variant="outlined">
                    {t('common.edit')}
                  </NmLink>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    onClick={() => setShouldShowConfirmRefreshKeysModal(true)}
                    variant="outlined"
                  >
                    {t('common.refreshkeys')}
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={handleOpenDeleteModal}
                  >
                    {t('common.delete')}
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.id}
                  label={String(t('common.id'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.name}
                  label={String(t('common.name'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.version}
                  label={String(t('common.version'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.os}
                  label={String(t('common.os'))}
                />
              </Grid>

              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.publickey}
                  label={String(t('common.publickey'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.mtu}
                  label={String(t('common.mtu'))}
                />
              </Grid>

              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.locallistenport}
                  label={String(t('common.locallistenport'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.listenport}
                  label={String(t('common.listenport'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.proxy_listen_port}
                  label={String(t('common.proxylistenport'))}
                />
              </Grid>

              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  type="number"
                  value={host.verbosity}
                  label={String(t('common.verbosity'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.internetgateway}
                  label={String(t('common.internetgateway'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.defaultinterface}
                  label={String(t('common.defaultinterface'))}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <TextField
                  disabled
                  value={host.macaddress}
                  label={String(t('common.macaddress'))}
                />
              </Grid>

              <Grid item xs={12} md={3} sx={rowMargin}>
                <FormControlLabel
                  label={String(t('common.isdefault'))}
                  control={<SwitchField checked={host.isdefault} disabled />}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <FormControlLabel
                  label={String(t('common.debug'))}
                  control={<SwitchField checked={host.debug} disabled />}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <FormControlLabel
                  label={String(t('hosts.proxyenabled'))}
                  control={
                    <SwitchField checked={host.proxy_enabled} disabled />
                  }
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={3} sx={rowMargin}>
                <FormControlLabel
                  label={String(t('hosts.isstatic'))}
                  control={<SwitchField checked={host.isstatic} disabled />}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6} sx={rowMargin}>
                <List>
                  <ListItem disablePadding sx={{ marginBottom: '1rem' }}>
                    Interfaces
                  </ListItem>
                  {host.interfaces.map((iface, i) => (
                    <ListItem disablePadding key={`iface-${i}`}>
                      <ListItemButton
                        onClick={() => {
                          copy(iface.addressString || iface.address.IP)
                        }}
                        sx={{ borderBottom: '1px solid' }}
                      >
                        <ListItemText
                          primary={`${iface.name} (${
                            iface.addressString || iface.address.IP
                          })`}
                        />
                        <CopyAllOutlined />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </>
          )}

          {/* networks */}
          {pageView === 'networks' && (
            // networks
            <>
              <Grid container item xs={12} sx={rowMargin}>
                <Grid item xs={12}>
                  <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>
                    {t('hosts.connectednetworkstitle')}
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={rowMargin}>
                  <HostNetworksTable hostid={hostId} />
                </Grid>
              </Grid>
            </>
          )}

          {/* relay */}
          {pageView === 'relay-status' && (
            <>
              <Grid container item xs={12} sx={rowMargin}>
                <Grid item xs={12} md={3} sx={rowMargin}>
                  <TextField
                    disabled
                    value={host.isrelayed}
                    label={String(t('hosts.isrelayed'))}
                  />
                </Grid>
                <Grid item xs={12} md={3} sx={rowMargin}>
                  <TextField
                    disabled
                    value={host.relayed_by}
                    label={String(t('hosts.relayedby'))}
                    InputProps={{
                      endAdornment: host.isrelayed ? (
                        <InputAdornment position="end">
                          <NmLink to={`/hosts/${host.relayed_by}`}>
                            <Visibility />
                          </NmLink>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={rowMargin}>
                  <FormControlLabel
                    label={String(t('hosts.isrelay'))}
                    control={
                      <SwitchField
                        checked={host.isrelay}
                        onChange={(_, isCreating) => {
                          if (isCreating) setShowCreateRelayModal(true)
                          else handleOpenDeleteRelayModal()
                        }}
                      />
                    }
                  />
                </Grid>

                {host.isrelay && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h5">Relay hosts</Typography>
                    </Grid>
                    <Grid item xs={12} sx={rowMargin}>
                      <HostRelayTable hostid={hostId} />
                    </Grid>
                  </>
                )}
              </Grid>
            </>
          )}

          {/* modals */}
          <CustomDialog
            open={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            handleAccept={handleDeleteHost}
            message={`${t('common.confirmdeletequestion')} ${host.name}?`}
            title={`${t('common.confirmdelete')}`}
          />
          <CreateRelayModal
            hostId={hostId}
            open={showCreateRelayModal}
            onClose={() => {
              setShowCreateRelayModal(false)
            }}
          />
          <CustomDialog
            open={showDeleteRelayModal}
            handleClose={handleCloseDeleteRelayModal}
            handleAccept={handleDeleteRelay}
            message={`${t('common.confirmdeletequestion')} relay ${host.name}?`}
            title={`${t('common.confirmdelete')}`}
          />
        </Grid>

        {/* modals */}
        <CustomizedDialogs
          open={shouldShowConfirmRefreshKeysModal}
          handleClose={() => setShouldShowConfirmRefreshKeysModal(false)}
          handleAccept={() => refreshKeys()}
          message={t('hosts.refreshconfirm')}
          title={`${t('hosts.refreshkeysfor')} ${host?.name}`}
        />
      </Route>
    </Switch>
  )
}
