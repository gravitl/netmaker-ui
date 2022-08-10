import React from 'react'
import { NmLink } from '~components/index'
import { NmTable, TableColumns } from '~components/Table'
import { Node } from '~modules/node'
import { useTranslation } from 'react-i18next'
import {
  useRouteMatch,
  useParams,
  Route,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNetwork } from '~util/network'
import { NodeId } from '../../../route/nodes/netid/nodeId/NodeId'
import {
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  AccountTree,
  AltRoute,
  CallMerge,
  CallSplit,
  Delete,
  Search,
  Sync,
  Hub,
} from '@mui/icons-material'
import { i18n } from '../../../i18n/i18n'
import { CreateEgress } from '../../../route/nodes/netid/components/CreateEgress'
import { TableToggleButton } from '../../../route/nodes/netid/components/TableToggleButton'
import { CreateRelay } from '../../../route/nodes/netid/components/CreateRelay'
import { NetworkSelect } from '../../../components/NetworkSelect'
import { useDispatch, useSelector } from 'react-redux'
import { deleteNode, setNodeSort } from '~store/modules/node/actions'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { HubButton } from '../../../route/nodes/netid/components/HubButton'
import { MultiCopy } from '~components/CopyText'
import { nodeSelectors } from '~store/selectors'
import { Tablefilter } from '~components/filter/Tablefilter'
import { useEffect, useState } from 'react'
import { tempNodes } from './vpnview/components/testdata'

export const NodeAccessView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const network = useNetwork(netid)
  // eslint-disable-next-line
  const listOfNodes = tempNodes
  const nodeSort = useSelector(nodeSelectors.getNodeSort)
  const [filterNodes, setFilterNodes] = React.useState(listOfNodes)
  const [selected, setSelected] = React.useState({} as Node)
  const dispatch = useDispatch()
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState(' ')

  useEffect(() => {
    if (!!!searchTerm) {
      setFilterNodes(listOfNodes)
    } else {
      setFilterNodes(
        listOfNodes.filter((node) =>
          `${node.name}${node.address}${node.network}`.includes(searchTerm)
        )
      )
    }
  }, [listOfNodes, searchTerm])

  const handleFilter = (event: { target: { value: string } }) => {
    const { value } = event.target
    const searchTerm = value.trim()
    setSearchTerm(searchTerm)
  }

  useLinkBreadcrumb({
    link: url,
    title: t('breadcrumbs.nodes'),
  })

  const syncNodes = () => {
    if (!!netid) {
      history.push(`/nodes/${netid}`)
    }
  }

  if (!listOfNodes || !!!network) {
    return <h5>Not found, data missing</h5>
  }

  const columns: TableColumns<Node> = [
    {
      id: 'name',
      labelKey: 'node.name',
      minWidth: 100,
      sortable: true,
      format: (value, node) => (
        <NmLink
          to={`/nodes/${node.network}/${encodeURIComponent(node.id)}`}
          sx={{ textTransform: 'none' }}
        >
          {value}
          {`${
            node.ispending === 'yes' ? ` (${i18n.t('common.pending')})` : ''
          }`}
        </NmLink>
      ),
    },
    {
      id: 'address',
      labelKey: 'node.addresses',
      minWidth: 130,
      align: 'right',
      format: (_, node) => (
        <MultiCopy type="subtitle2" values={[node.address, node.address6]} />
      ),
    },
    {
      id: 'version',
      labelKey: 'node.version',
      minWidth: 50,
      align: 'center',
      format: (value) => <>{!!value ? value : 'N/A'}</>,
    },
    {
      id: 'network',
      labelKey: 'node.network',
      minWidth: 100,
      align: 'right',
      format: (value) => (
        <Tooltip
          disableTouchListener={true}
          title={`${t('node.connected') as string}${value}`}
          placement="top"
        >
          <NmLink sx={{ textTransform: 'none' }} to={`/networks/${value}`}>
            {value}
          </NmLink>
        </Tooltip>
      ),
    },
    {
      id: 'isegressgateway',
      labelKey: 'node.statusegress',
      minWidth: 30,
      align: 'center',
      format: (isegress, row) => (
        <TableToggleButton
          which="egress"
          isOn={isegress}
          node={row}
          createText={`${i18n.t('node.createegress')} : ${row.name}`}
          removeText={`${i18n.t('node.removeegress')} : ${row.name}`}
          SignalIcon={<CallSplit />}
          withHistory
        />
      ),
    },
    {
      id: 'isingressgateway',
      labelKey: 'node.statusingress',
      minWidth: 30,
      align: 'center',
      format: (isingress, row) => (
        <TableToggleButton
          which="ingress"
          isOn={isingress}
          node={row}
          createText={`${i18n.t('node.createingress')} : ${row.name}`}
          removeText={`${i18n.t('node.removeingress')} : ${row.name}`}
          SignalIcon={<CallMerge />}
        />
      ),
    },
    {
      id: 'isrelay',
      labelKey: 'node.statusrelay',
      minWidth: 30,
      align: 'center',
      format: (isrelay, row) => (
        <TableToggleButton
          which="relay"
          isOn={isrelay}
          node={row}
          createText={`${i18n.t('node.createrelay')} : ${row.name}`}
          removeText={`${i18n.t('node.removerelay')} : ${row.name}`}
          SignalIcon={<AltRoute />}
          withHistory
        />
      ),
    },
    {
      id: 'lastcheckin',
      labelKey: 'node.status',
      minWidth: 170,
      align: 'center',
      format: (lastcheckin) => {
        const time = Date.now() / 1000
        if (time - lastcheckin >= 1800)
          return (
            <Tooltip title={t('node.error') as string} placement="top">
              <Chip color="error" label="ERROR" />
            </Tooltip>
          )
        if (time - lastcheckin >= 300)
          return (
            <Tooltip title={t('node.warning') as string} placement="top">
              <Chip color="warning" label="WARNING" />
            </Tooltip>
          )
        return (
          <Tooltip title={t('node.healthy') as string} placement="top">
            <Chip color="success" label="HEALTHY" />
          </Tooltip>
        )
      },
    },
  ]

  if (network.ispointtosite) {
    columns.push({
      id: 'ishub',
      labelKey: 'node.statushub',
      minWidth: 30,
      align: 'center',
      format: (_, row) => (
        <HubButton
          node={row}
          createText={`${i18n.t('node.createhub')} : ${row.name}`}
          disabledText={`${i18n.t('node.onehub')} : ${row.name}`}
          SignalIcon={<Hub />}
        />
      ),
    })
  }

  const handleClose = () => {
    setSelected({} as Node)
  }

  const handleOpen = (node: Node) => {
    setSelected(node)
  }

  const handleDeleteNode = () => {
    if (!!selected.name) {
      dispatch(
        deleteNode.request({
          netid: selected.network,
          nodeid: selected.id,
        })
      )
      handleClose()
    }
  }

  const handleNodeSortSelect = (selection: string) => {
    if (
      selection === 'address' ||
      selection === 'name' ||
      selection === 'network'
    ) {
      dispatch(
        setNodeSort({
          ...nodeSort,
          value: selection,
        })
      )
    }
  }

  return (
    <Switch>
      <Route exact path={path}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} md={12}>
            <Grid container justifyContent="space-around" alignItems="center">
              <Grid item xs={8} md={4}>
                <Typography variant="h4">
                  {`${netid} ${t('node.nodes')}`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={2} md={1}>
                    <Tooltip
                      title={`${t('network.graph')}`}
                      placement="top"
                      aria-label="view node graph"
                    >
                      <IconButton component={Link} to={`/graphs/${netid}`}>
                        <AccountTree />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={5} md={3}>
                    <Tablefilter
                      values={['address', 'name', 'network']}
                      ascending={nodeSort.ascending}
                      onSelect={handleNodeSortSelect}
                      onAscendClick={() => {
                        dispatch(
                          setNodeSort({
                            ...nodeSort,
                            ascending: !nodeSort.ascending,
                          })
                        )
                      }}
                      currentValue={nodeSort.value}
                    />
                  </Grid>
                  <Grid item xs={8} md={3}>
                    <TextField
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      label={`${t('common.search')} ${t('node.nodes')}`}
                      onChange={handleFilter}
                    />
                  </Grid>
                  <Grid item xs={7.5} md={3} paddingBottom="1rem">
                    <NetworkSelect selectAll />
                  </Grid>
                  <Grid item xs={1} md={1}>
                    <Tooltip title={t('node.sync') as string} placement="top">
                      <IconButton color="primary" onClick={syncNodes}>
                        <Sync />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <hr />
        <NmTable
          columns={columns}
          rows={
            filterNodes.length && filterNodes.length < listOfNodes.length
              ? filterNodes
              : listOfNodes
          }
          actions={[
            (row) => ({
              tooltip: !row.isserver
                ? t('common.delete')
                : t('common.disabled'),
              disabled: row.isserver,
              icon: <Delete />,
              onClick: () => {
                handleOpen(row)
              },
            }),
          ]}
          getRowId={(row) => row.id}
        />
        <CustomizedDialogs
          open={!!selected.name}
          handleClose={handleClose}
          handleAccept={handleDeleteNode}
          message={t('node.deleteconfirm')}
          title={`${t('common.delete')} ${selected.name}`}
        />
      </Route>
      <Route
        path={`${path}/:nodeId/create-egress`}
        children={<CreateEgress />}
      />
      <Route path={`${path}/:nodeId/create-relay`} children={<CreateRelay />} />
      <Route path={`${path}/:nodeId`}>
        <NodeId />
      </Route>
    </Switch>
  )
}
