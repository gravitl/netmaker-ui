import React from 'react'
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
import { NodeEdit } from '../nodeEdit/NodeEdit'
import { approveNode, deleteNode } from '~modules/node/actions'
import CustomDialog from '~components/dialog/CustomDialog'
import { useNetwork } from '~util/network'
import { authSelectors } from '~store/selectors'
import { nodeACLValues } from '~store/types'

export const NodeId: React.FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { netid, nodeId } = useParams<{ nodeId: string; netid: string }>()
  const node = useNodeById(decodeURIComponent(nodeId))
  const network = useNetwork(netid)
  const user = useSelector(authSelectors.getUser)
  const [open, setOpen] = React.useState(false)
  const [approveOpen, setApproveOpen] = React.useState(false)

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

  if (!node || !network) {
    return <div>Not Found</div>
  }

  const handleDeleteNode = () => {
    dispatch(
      deleteNode.request({
        netid: node.network,
        nodeid: node.id,
      })
    )
    history.push(
      `/${t('breadcrumbs.networks')}/${netid}/${t('breadcrumbs.nodes')}`
    )
  }

  const handleApproveNode = () => {
    dispatch(
      approveNode.request({
        netid: node.network,
        nodeid: node.id,
      })
    )
  }

  const rowMargin = {
    margin: '1em 0 1em 0',
  }
  const isIPDynamic = !node.isstatic

  return (
    <Switch>
      <Route path={`${path}/edit`}>
        {/* <NodeEdit node={node} /> */}
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
            title={`${t('common.delete')} ${node.name}`}
          />
          <CustomDialog
            open={approveOpen}
            handleClose={handleApproveClose}
            handleAccept={handleApproveNode}
            message={t('node.approveconfirm')}
            title={`${t('node.approve')} ${node.name}`}
          />
          <Grid item xs={12}>
            <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
              <Typography variant="h5">
                {`${t('node.details')} : ${node.name}${
                  node.ispending === 'yes' ? ` (${t('common.pending')})` : ''
                }`}
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
              <NmLink
                to={`/metrics/${netid}/${nodeId}`}
                variant="outlined"
                style={{ width: '50%', margin: '4px' }}
              >
                {t('pro.metrics')}
              </NmLink>
              <Button
                disabled={node.isserver}
                variant="outlined"
                color="warning"
                style={{ width: '50%', margin: '4px' }}
                onClick={handleOpen}
              >
                {t('common.delete')}
              </Button>
              {network.allowmanualsignup &&
              node.ispending === 'yes' &&
              user?.isAdmin ? (
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
              value={node.endpoint}
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
              value={node.listenport}
              label={String(t('node.listenport'))}
            />
          </Grid>
          <Grid item xs={10} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={String(t('node.udpholepunch'))}
              control={<SwitchField checked={node.udpholepunch} disabled />}
              disabled
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
              value={node.name}
              label={String(t('node.name'))}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.publickey}
              label={String(t('node.publickey'))}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.postup}
              label={String(t('node.postup'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.postdown}
              label={String(t('node.postdown'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.allowedips ? node.allowedips.join(',') : ''}
              label={String(t('node.allowedips'))}
            />
          </Grid>
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
              value={node.localrange}
              label={String(t('node.localrange'))}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.os} label={String(t('node.os'))} />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.mtu}
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
              value={node.defaultacl === undefined ? nodeACLValues.unset : 
                node.defaultacl ? nodeACLValues.allow : nodeACLValues.deny}
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
                <FormControlLabel
                  label={String(t('node.ishub'))}
                  control={<SwitchField checked={node.ishub} disabled />}
                  disabled
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Route>
    </Switch>
  )
}
