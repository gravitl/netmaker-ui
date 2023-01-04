import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import { useTranslation } from 'react-i18next'
import { red, orange, green, grey } from '@mui/material/colors'
import { Node, Network } from '~store/types'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import {
  AltRoute,
  ArrowRightAlt,
  CallMerge,
  CallSplit,
  Circle,
  Close,
  Edit,
  ViewList,
} from '@mui/icons-material'
import { AltDataNode } from './types'
import { isNodeHealthy } from '~util/fields'
import { Link } from 'react-router-dom'
import { TableToggleButton } from '../../../nodes/netid/components/TableToggleButton'
import { deleteNode } from '~store/modules/node/actions'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { authSelectors, hostsSelectors, serverSelectors } from '~store/selectors'
import { MultiCopy } from '~components/CopyText'
import MetricsIcon from '@mui/icons-material/Insights'

const styles = {
  multiCopy: {
    marginLeft: '-.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  } as any,
}

interface NodeDetailsProps {
  data: Node | undefined
  handleClose: () => void
  altData: AltDataNode | undefined
  network: Network
}

const NodeDetails: React.FC<NodeDetailsProps> = ({
  data,
  handleClose,
  altData,
  network,
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const inDarkMode = useSelector(authSelectors.isInDarkMode)
  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
  const legendData = [
    { label: `${t('node.state.normal')} ${t('node.node')}`, color: '#2b00ff' },
    { label: t('node.isegressgateway'), color: '#6bdbb6' },
    { label: t('node.isingressgateway'), color: '#ebde34' },
    { label: t('node.isingressegress'), color: '#d9ffa3' },
    { label: t('node.isrelay'), color: '#a552ff' },
    { label: t('node.isingressrelay'), color: '#d5db8a' },
    { label: t('node.isegressrelay'), color: '#19ffb2' },
    { label: t('node.isrelayed'), color: '#639cbf' },
    { label: t('node.isingressegressrelay'), color: '#f2c7ff' },
    { label: t('extclient.extclient'), color: '#26ffff' },
    { label: t('common.cidr'), color: '#6fa397' },
    { label: t('node.state.warning'), color: '#ff9800' },
    { label: t('node.state.error'), color: '#f44336' },
  ]

  var nodeHealth: number
  if (!!data && !!data.id) {
    nodeHealth = isNodeHealthy(data.lastcheckin)
  } else {
    nodeHealth = 0
  }

  const handleDeleteNode = () => {
    if (!!data && !!data.id) {
      dispatch(
        deleteNode.request({
          netid: data.network,
          nodeid: data.id,
        })
      )
      handleClose()
    }
  }

  // const handleOpenPrompt = () => {
  //   setOpen(true)
  // }

  const handleClosePrompt = () => {
    setOpen(false)
  }

  return !!data && !!data.id ? (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: inDarkMode ? '#272727' : '#f0f0f0',
      }}
    >
      <CustomizedDialogs
        open={open}
        handleClose={handleClosePrompt}
        handleAccept={handleDeleteNode}
        message={t('node.deleteconfirm')}
        title={`${t('common.delete')} ${hostsMap[data.hostid]?.name ?? ''}`}
      />
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: () => {
                if (nodeHealth === 2) return red[500]
                if (nodeHealth === 1) return orange[500]
                return green[500]
              },
            }}
            aria-label="node-status"
          >
            {hostsMap[data.hostid]?.name.substring(0, 1) ?? ''}
          </Avatar>
        }
        action={
          <IconButton aria-label="close node details" onClick={handleClose}>
            <Close />
          </IconButton>
        }
        title={`${hostsMap[data.hostid]?.name ?? ''} (${
          nodeHealth === 0 ? 'HEALTHY' : nodeHealth === 1 ? 'WARNING' : 'ERROR'
        })`}
        subheader={hostsMap[data.hostid]?.endpointip ?? ''}
      />
      <CardActions>
        <Tooltip
          title={`${t('common.edit')} ${t('node.node')}`}
          placement="top"
        >
          <IconButton
            aria-label="edit node"
            component={Link}
            to={`/nodes/${data.network}/${data.id}/edit`}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <TableToggleButton
          which="egress"
          isOn={data.isegressgateway}
          node={data}
          createText={`${t('node.createegress')} : ${hostsMap[data.hostid]?.name ?? ''}`}
          removeText={`${t('node.removeegress')} : ${hostsMap[data.hostid]?.name ?? ''}`}
          SignalIcon={<CallSplit />}
          withHistory
          extraLogic={handleClose}
        />
        <TableToggleButton
          which="ingress"
          isOn={data.isingressgateway}
          node={data}
          createText={`${t('node.createingress')} : ${hostsMap[data.hostid]?.name ?? ''}`}
          removeText={`${t('node.removeingress')} : ${hostsMap[data.hostid]?.name ?? ''}`}
          SignalIcon={<CallMerge />}
          extraLogic={handleClose}
        />
        <TableToggleButton
          which="relay"
          isOn={data.isrelay}
          node={data}
          createText={`${t('node.createrelay')} : ${hostsMap[data.hostid]?.name ?? ''}`}
          removeText={`${t('node.removerelay')} : ${hostsMap[data.hostid]?.name ?? ''}`}
          SignalIcon={<AltRoute />}
          withHistory
          extraLogic={handleClose}
        />
        <Tooltip
          title={`${t('acls.nodeview')} ${t('node.node')}`}
          placement="top"
        >
          <IconButton
            component={Link}
            to={`/acls/${data.network}/${data.id}`}
            aria-label="view-node-acl"
          >
            <ViewList />
          </IconButton>
        </Tooltip>
        {serverConfig.IsEE && (
          <Tooltip title={`${t('pro.metrics')}`} placement="top">
            <IconButton
              component={Link}
              to={`/metrics/${data.network}/${data.id}`}
              aria-label="view-metrics"
            >
              <MetricsIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
      <CardContent>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <ArrowRightAlt />
            </ListItemIcon>
            <ListItemText
              primary={
                <div style={styles.multiCopy}>
                  <MultiCopy
                    type="caption"
                    values={[data.address, data.address6]}
                  />
                </div>
              }
              secondary={t('node.addresses')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowRightAlt />
            </ListItemIcon>
            <ListItemText
              primary={
                <div style={styles.multiCopy}>
                  <MultiCopy type="caption" values={[hostsMap[data.hostid]?.publickey ?? '']} />
                </div>
              }
              secondary={t('node.publickey')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowRightAlt />
            </ListItemIcon>
            <ListItemText primary={data.id} secondary={t('node.id')} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowRightAlt />
            </ListItemIcon>
            <ListItemText primary={hostsMap[data.hostid]?.os || 'N/A'} secondary={t('node.os')} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowRightAlt />
            </ListItemIcon>
            <ListItemText
              primary={hostsMap[data.hostid]?.version || 'N/A'}
              secondary={t('node.version')}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  ) : !!altData && !!altData.id ? (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: inDarkMode ? '#272727' : '#f0f0f0',
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: grey[500] }}
            aria-label={`${altData.type}-status`}
          >
            {altData.name.substring(0, 3)}
          </Avatar>
        }
        action={
          <IconButton aria-label="close node details" onClick={handleClose}>
            <Close />
          </IconButton>
        }
        title={altData.name}
        subheader={
          altData.type === 'cidr' ? t('common.cidr') : t('extclient.extclient')
        }
      />
      <CardContent>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <ArrowRightAlt />
            </ListItemIcon>
            <ListItemText primary={altData.id} secondary={t('node.id')} />
          </ListItem>
          {!!altData.address && (
            <ListItem>
              <ListItemIcon>
                <ArrowRightAlt />
              </ListItemIcon>
              <ListItemText
                primary={
                  <div style={styles.multiCopy}>
                    <MultiCopy type="caption" values={[altData.address]} />
                  </div>
                }
                secondary={t('node.address')}
              />
            </ListItem>
          )}
          {!!altData.address6 && (
            <ListItem>
              <ListItemIcon>
                <ArrowRightAlt />
              </ListItemIcon>
              <ListItemText
                primary={
                  <div style={styles.multiCopy}>
                    <MultiCopy type="caption" values={[altData.address6]} />
                  </div>
                }
                secondary={t('node.address6')}
              />
            </ListItem>
          )}
          <ListItem>
            <ListItemIcon>
              <ArrowRightAlt />
            </ListItemIcon>
            <ListItemText
              primary={
                altData.type === 'cidr'
                  ? t('common.cidr')
                  : t('extclient.extclient')
              }
              secondary={t('common.type')}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  ) : (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: inDarkMode ? '#272727' : '#f0f0f0',
      }}
    >
      <CardContent>
        <List dense>
          {legendData.map((indicator) => (
            <ListItem key={indicator.label}>
              <ListItemIcon>
                <Circle htmlColor={indicator.color} />
              </ListItemIcon>
              <ListItemText primary={indicator.label} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default NodeDetails
