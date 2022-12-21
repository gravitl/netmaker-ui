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
import { useNodeById } from '~util/node'
import { datePickerConverter } from '~util/unixTime'
// import { NodeEdit } from '../nodeEdit/NodeEdit'
import { approveNode, deleteNode } from '~modules/node/actions'
import CustomDialog from '~components/dialog/CustomDialog'
import { useNetwork } from '~util/network'
import { authSelectors } from '~store/selectors'
import { nodeACLValues } from '~store/types'
import { NotFound } from '~util/errorpage'
import { Host } from '~store/modules/hosts/types'
import { NodeTable } from '../nodes/components/NodeTable'
import { HostNetworksTable } from './components/HostNetworksTable'

export const HostsDetailPage: FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { hostId } = useParams<{ hostId: string }>()
  // const host: Host | null = useFindHostById(decodeURIComponent(hostId))
  const host: Host | null = { name: 'mock-host', verbosity: 4 } as any
  const user = useSelector(authSelectors.getUser)
  const [open, setOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)

  useLinkBreadcrumb({
    link: url,
    title: decodeURIComponent(hostId),
  })

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleApproveOpen = () => setApproveOpen(true)
  const handleApproveClose = () => setApproveOpen(false)

  const rowMargin = {
    margin: '1em 0 1em 0',
  }

  const handleDeleteHost = useCallback(() => {
    // dispatch(
    //   deleteNode.request({
    //     netid: host.network,
    //     nodeid: host.id,
    //   })
    // )
    // history.push(
    //   `/${t('breadcrumbs.networks')}/${netid}/${t('breadcrumbs.nodes')}`
    // )
  }, [])

  const handleApproveHost = useCallback(() => {
    // dispatch(
    //   approveNode.request({
    //     netid: host.network,
    //     nodeid: host.id,
    //   })
    // )
  }, [])

  if (!host) {
    return <NotFound />
  } else
    return (
      <Switch>
        {/* <Route path={`${path}/edit`}>
          <NodeEdit
            onCancel={() => {
              history.push(url.replace(':hostId', host.id).replace('/edit', ''))
            }}
          />
        </Route> */}

        <Route exact path={path}>
          <Grid container>
            {/* modals */}
            <CustomDialog
              open={open}
              handleClose={handleClose}
              handleAccept={handleDeleteHost}
              message={t('common.deleteconfirm')}
              title={`${t('common.delete')} ${host.name}`}
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
                  onClick={handleOpen}
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
                control={
                  <SwitchField checked={host.daemoninstalled} disabled />
                }
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
