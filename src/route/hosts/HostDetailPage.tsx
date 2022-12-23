import { FC, useCallback, useState } from 'react'
import {
  Button,
  Grid,
  TextField,
  Switch as SwitchField,
  FormControlLabel,
  Typography,
} from '@mui/material'
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
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import CustomDialog from '~components/dialog/CustomDialog'
import { hostsSelectors } from '~store/selectors'
import { NotFound } from '~util/errorpage'
import { Host } from '~store/modules/hosts/types'
import { HostNetworksTable } from './components/HostNetworksTable'
import { HostEditPage } from './HostEditPage'
import { deleteHost, getHosts } from '~store/modules/hosts/actions'
import { useGetHostById } from '~util/hosts'

export const HostDetailPage: FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { hostId } = useParams<{ hostId: string }>()
  const host = useGetHostById(decodeURIComponent(hostId))
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useLinkBreadcrumb({
    link: url,
    title: decodeURIComponent(hostId),
  })

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true)
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
          {/* modals */}
          <CustomDialog
            open={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            handleAccept={handleDeleteHost}
            message={`${t('common.confirmdeletequestion')} ${host.name}?`}
            title={`${t('common.confirmdelete')}`}
          />

          <Grid item xs={12}>
            <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
              <Typography variant="h5">
                {`${t('hosts.details')} : ${host.name}`}
              </Typography>
            </div>
          </Grid>

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
                variant="outlined"
                color="error"
                onClick={handleOpenDeleteModal}
              >
                {t('common.delete')}
              </Button>
            </Grid>
          </Grid>

          {/* host details */}
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
              value={host.traffickeypublic}
              label={String(t('common.traffickeypublic'))}
            />
          </Grid>
          <Grid item xs={12} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={host.localaddress}
              label={String(t('common.localaddress'))}
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
              value={host.localrange}
              label={String(t('common.localrange'))}
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
              value={host.firewallinuse}
              label={String(t('common.firewallinuse'))}
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
              label={String(t('common.ipforwarding'))}
              control={<SwitchField checked={host.ipforwarding} disabled />}
              disabled
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
              label={String(t('common.daemoninstalled'))}
              control={<SwitchField checked={host.daemoninstalled} disabled />}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={3} sx={rowMargin}>
            <FormControlLabel
              label={String(t('hosts.proxyenabled'))}
              control={<SwitchField checked={host.proxyenabled} disabled />}
              disabled
            />
          </Grid>

          {/* nodes */}
          <Grid container item xs={12} sx={rowMargin}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>
                {t('hosts.connectednetworkstitle')}
              </Typography>
            </Grid>

            <Grid item xs={12} sx={rowMargin}>
              <HostNetworksTable hostId={hostId} />
            </Grid>
          </Grid>
        </Grid>
      </Route>
    </Switch>
  )
}
