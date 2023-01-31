import { FC, useState, useCallback, useMemo } from 'react'
import {
  Button,
  Grid,
  TextField,
  Switch as SwitchField,
  FormControlLabel,
  Typography,
  Modal,
  Box,
  useTheme,
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
import { NodeEdit } from '../nodeEdit/NodeEdit'
import { approveNode, deleteNode } from '~modules/node/actions'
import CustomDialog from '~components/dialog/CustomDialog'
import { useNetwork } from '~util/network'
import {
  authSelectors,
  hostsSelectors,
  serverSelectors,
} from '~store/selectors'
import { NotFound } from '~util/errorpage'

const styles = {
  centerText: {
    textAlign: 'center',
  },
  vertTabs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  mainContainer: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    display: 'flex',
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    backgroundColor: 'white',
    border: '1px solid #000',
    minWidth: '33%',
    pt: 2,
    px: 4,
    pb: 3,
  },
} as any

export const NodeId: FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
  const { netid, nodeId } = useParams<{ nodeId: string; netid: string }>()
  const node = useNodeById(decodeURIComponent(nodeId))
  const network = useNetwork(netid)
  const user = useSelector(authSelectors.getUser)
  const [open, setOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const [shouldShowProModal, setShouldShowProModal] = useState(false)
  const theme = useTheme()

  useLinkBreadcrumb({
    link: url,
    title: decodeURIComponent(nodeId),
  })

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleApproveOpen = () => setApproveOpen(true)
  const handleApproveClose = () => setApproveOpen(false)

  const handleDeleteNode = useCallback(() => {
    if (!node) return
    dispatch(
      deleteNode.request({
        netid: node.network,
        nodeid: node.id,
      })
    )
    history.push(
      `/${t('breadcrumbs.networks')}/${netid}/${t('breadcrumbs.nodes')}`
    )
  }, [dispatch, history, netid, node, t])

  const handleApproveNode = useCallback(() => {
    if (!node) return
    dispatch(
      approveNode.request({
        netid: node.network,
        nodeid: node.id,
      })
    )
  }, [dispatch, node])

  const rowMargin = {
    margin: '1em 0 1em 0',
  }

  const isEE = useMemo(() => serverConfig.IsEE, [serverConfig])

  const onMetricsClick = useCallback(() => {
    if (isEE) {
      history.push(`/metrics/${netid}/${nodeId}`)
      return
    }
    setShouldShowProModal(true)
  }, [history, isEE, netid, nodeId])

  const isIPDynamic = !hostsMap[node?.hostid ?? '']?.isstatic

  if (!node || !network) {
    return <NotFound />
  }

  return (
    <Switch>
      <Route path={`${path}/edit`}>
        <NodeEdit
          onCancel={() => {
            history.push(
              url
                .replace(':netid', node.network)
                .replace(':nodeId', node.id)
                .replace('/edit', '')
            )
          }}
        />
      </Route>
      <Route exact path={path}>
        <Grid container>
          <CustomDialog
            open={open}
            handleClose={handleClose}
            handleAccept={handleDeleteNode}
            message={t('node.deleteconfirm')}
            title={`${t('common.delete')} ${hostsMap[node.hostid]?.name ?? ''}`}
          />
          <CustomDialog
            open={approveOpen}
            handleClose={handleApproveClose}
            handleAccept={handleApproveNode}
            message={t('node.approveconfirm')}
            title={`${t('node.approve')} ${hostsMap[node.hostid]?.name ?? ''}`}
          />
          <Grid item xs={12}>
            <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
              <Typography variant="h5">
                {`${t('node.details')}: ${hostsMap[node.hostid]?.name ?? ''}`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6} sm={6} md={6} sx={rowMargin}>
            <div
              style={{
                display: 'flex',
                alignItems: 'space-between',
                justifyContent: 'center',
              }}
            >
              <NmLink
                to={`${url}/edit`}
                variant="outlined"
                style={{ width: '50%', margin: '4px' }}
                disabled={node.pendingdelete}
              >
                {t('common.edit')}
              </NmLink>
              <NmLink
                to={`/acls/${netid}/${nodeId}`}
                variant="outlined"
                style={{ width: '50%', margin: '4px' }}
              >
                {t('header.acls')}
              </NmLink>
              <Button
                variant="outlined"
                style={{ width: '50%', margin: '4px' }}
                onClick={onMetricsClick}
              >
                {t('pro.metrics')}
              </Button>
              <NmLink
                to={`/hosts/${node.hostid}`}
                variant="outlined"
                style={{ width: '50%', margin: '4px' }}
              >
                {t('common.host')}
              </NmLink>
              <Button
                variant="outlined"
                color="warning"
                style={{ width: '50%', margin: '4px' }}
                onClick={handleOpen}
              >
                {t('common.delete')}
              </Button>
              {network.allowmanualsignup && user?.isAdmin ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ width: '50%', margin: '4px' }}
                  onClick={handleApproveOpen}
                >
                  {t('node.approve')}
                </Button>
              ) : null}
            </div>
          </Grid>
          <Grid item xs={6} sm={3} sx={rowMargin}></Grid>
          <Grid item xs={6} sm={3} sx={rowMargin}></Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={hostsMap[node.hostid]?.endpointip ?? ''}
              label={String(t('node.endpoint'))}
            />
          </Grid>
          <Grid item xs={10} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={String(t('node.isstatic'))}
              control={<SwitchField checked={isIPDynamic} disabled />}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={hostsMap[node.hostid]?.listenport ?? ''}
              label={String(t('node.listenport'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.address}
              label={String(t('node.address'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.address6}
              label={String(t('node.address6'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.localaddress}
              label={String(t('node.localaddress'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={hostsMap[node.hostid]?.name ?? ''}
              label={String(t('node.name'))}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={hostsMap[node.hostid]?.publickey ?? ''}
              label={String(t('node.publickey'))}
            />
          </Grid>

          {/* <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.postup}
              label={String(t('node.postup'))}
            />
          </Grid> */}
          {/* <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.postdown}
              label={String(t('node.postdown'))}
            />
          </Grid> */}
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.persistentkeepalive}
              label={String(t('node.persistentkeepalive'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.lastmodified)}
              label={String(t('node.lastmodified'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.expdatetime)}
              label={String(t('node.expdatetime'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.lastcheckin)}
              label={String(t('node.lastcheckin'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.macaddress}
              label={String(t('node.macaddress'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={
                node.egressgatewayranges
                  ? node.egressgatewayranges.join(',')
                  : ''
              }
              label={String(t('node.egressgatewayranges'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={hostsMap[node.hostid]?.localrange ?? ''}
              label={String(t('node.localrange'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={hostsMap[node.hostid]?.os ?? ''}
              label={String(t('node.os'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={hostsMap[node.hostid]?.mtu ?? ''}
              label={String(t('node.mtu'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.network}
              label={String(t('node.network'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.defaultacl}
              label={String(t('node.defaultacl'))}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={10} sm={4} md={2} sx={rowMargin}>
                <FormControlLabel
                  label={String(t('node.dnson'))}
                  control={<SwitchField checked={node.dnson} disabled />}
                  disabled
                />
              </Grid>
              <Grid item xs={10} sm={4} md={2} sx={rowMargin}>
                <FormControlLabel
                  label={String(t('node.islocal'))}
                  control={<SwitchField checked={node.islocal} disabled />}
                  disabled
                />
              </Grid>
              <Grid item xs={10} sm={4} md={2} sx={rowMargin}>
                <span>
                  <FormControlLabel
                    label={String(t('node.togglenode'))}
                    name={'connected'}
                    control={<SwitchField checked={node.connected} disabled />}
                  />
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* modals */}
        <Modal
          open={shouldShowProModal}
          onClose={() => setShouldShowProModal(false)}
        >
          <Box
            style={{
              ...styles.modal,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Grid
              container
              justifyContent="space-around"
              alignItems="center"
              sx={{ padding: '2em' }}
            >
              <Grid item xs={12} textAlign="center">
                <Typography variant="h6">
                  Great! You have found a PRO feature. <br />
                </Typography>
                <Typography variant="h5" sx={{ marginTop: '2rem' }}>
                  Click{' '}
                  <a
                    target="_blank"
                    href="https://netmaker.io/enterprise"
                    rel="noreferrer"
                  >
                    here
                  </a>{' '}
                  to get a pro license
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Route>
    </Switch>
  )
}
