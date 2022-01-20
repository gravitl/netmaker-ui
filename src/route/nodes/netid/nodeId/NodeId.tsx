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

export const NodeId: React.FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { netid, nodeId } =
    useParams<{ nodeId: string; netid: string }>()
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
                {`${t('node.details')} : ${node.name}${node.ispending === 'yes' ? ` (${t('common.pending')})` : ''}`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6} sm={6} md={6} sx={rowMargin}>
            <div style={{display: 'flex', alignItems: 'space-between', justifyContent: 'center'}}>
              <NmLink to={`${url}/edit`} variant="outlined" style={{width: '50%', margin: '4px'}}>
                {t('common.edit')}
              </NmLink>
              <Button variant="outlined" color='warning' style={{width: '50%', margin: '4px'}} onClick={handleOpen}>
                {t('common.delete')}
              </Button>
              {network.allowmanualsignup && node.ispending === 'yes' && user?.isAdmin ?
                <Button variant="outlined" color='secondary' style={{width: '50%', margin: '4px'}} onClick={handleApproveOpen}>
                  {t('node.approve')}
                </Button>
              : null}
            </div>
          </Grid>
          <Grid item xs={6} sm={3} sx={rowMargin}>
          </Grid>
          <Grid item xs={6} sm={3} sx={rowMargin}>
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.address}
              label={t('node.address')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.address6}
              label={t('node.address6')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.localaddress}
              label={t('node.localaddress')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.name} label={t('node.name')} />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.listenport}
              label={t('node.listenport')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.publickey}
              label={t('node.publickey')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.endpoint}
              label={t('node.endpoint')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.postup} label={t('node.postup')} />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.postdown}
              label={t('node.postdown')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.allowedips ? node.allowedips.join(',') : ''}
              label={t('node.allowedips')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.persistentkeepalive}
              label={t('node.persistentkeepalive')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.lastmodified)}
              label={t('node.lastmodified')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.expdatetime)}
              label={t('node.expdatetime')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.lastcheckin)}
              label={t('node.lastcheckin')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.macaddress}
              label={t('node.macaddress')}
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
              label={t('node.egressgatewayranges')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.localrange}
              label={t('node.localrange')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.os} label={t('node.os')} />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.mtu} label={t('node.mtu')} />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.network}
              label={t('node.network')}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.saveconfig')}
              control={<SwitchField checked={node.saveconfig} disabled />}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.isstatic')}
              control={<SwitchField checked={node.isstatic} disabled />}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.udpholepunch')}
              control={<SwitchField checked={node.udpholepunch} disabled />}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.dnson')}
              control={<SwitchField checked={node.dnson} disabled />}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.isdualstack')}
              control={<SwitchField checked={node.isdualstack} disabled />}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.islocal')}
              control={<SwitchField checked={node.islocal} disabled />}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.roaming')}
              control={<SwitchField checked={node.roaming} disabled />}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.ipforwarding')}
              control={<SwitchField checked={node.ipforwarding} disabled />}
              disabled
            />
          </Grid>
        </Grid>
      </Route>
    </Switch>
  )
}
