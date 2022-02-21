import React from 'react'
import { NmLink } from '~components/index'
import { NmTable, TableColumns } from '~components/Table'
import { Node } from '~modules/node'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams, Route, Switch, Link, useHistory } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNetwork, useNodesByNetworkId } from '~util/network'
import { NodeId } from './nodeId/NodeId'
import { Chip, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material'
import { AccountTree, AltRoute, CallMerge, CallSplit, Delete, Search, Sync, Hub } from '@mui/icons-material'
import { i18n } from '../../../i18n/i18n'
import { CreateEgress } from './components/CreateEgress'
import { TableToggleButton } from './components/TableToggleButton'
import { CreateRelay } from './components/CreateRelay'
import { NetworkSelect } from '../../../components/NetworkSelect'
import { useDispatch } from 'react-redux'
import { deleteNode } from '~store/modules/node/actions'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { HubButton } from './components/HubButton'


export const NetworkNodes: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const network = useNetwork(netid)
  const listOfNodes = useNodesByNetworkId(netid) || []
  const [ filterNodes, setFilterNodes ] = React.useState(listOfNodes)
  const [selected, setSelected] = React.useState({} as Node)
  const dispatch = useDispatch()
  const history = useHistory()

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
          to={`/nodes/${node.network}/${encodeURIComponent(
            node.id
          )}`}
          sx={{textTransform: 'none'}}
        >
          {value}{`${node.ispending === 'yes' ? ` (${i18n.t('common.pending')})` : ''}`}
        </NmLink>
      ),
    },
    {
      id: 'address',
      labelKey: 'node.address',
      minWidth: 170,
      align: 'right',
    },
    {
      id: 'network',
      labelKey: 'node.network',
      minWidth: 170,
      align: 'right',
      format: (value) => <NmLink sx={{textTransform: 'none'}} to={`/networks/${value}`}>{value}</NmLink>,
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
          return <Chip color="error" label="ERROR" />
        if (time - lastcheckin >= 300)
          return <Chip color="warning" label="WARNING" />
        return <Chip color="success" label="HEALTHY" />
      },
    },
  ]

  if (network.ispointtosite) {
    columns.push(
      {
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
      },
    )
  }

  const handleFilter = (event: {target: {value: string}}) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterNodes(listOfNodes)
    } else {
      setFilterNodes(listOfNodes.filter(node => `${node.name}${node.address}${node.network}`.includes(searchTerm)))
    }
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

  return (
    <Switch>
      <Route exact path={path}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={4}>
                <Typography variant="h4">
                  {`${netid} ${t('node.nodes')}`}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={1}>
                    <Tooltip title={`${t('network.graph')}`} placement='top' aria-label='view node graph'>
                      <IconButton component={Link} to={`/graphs/${netid}`}>
                        <AccountTree />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4}>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    label={`${t('common.search')} ${t('node.nodes')}`} 
                    onChange={handleFilter} 
                  />
                  </Grid>
                  <Grid item xs={6}>
                    <NetworkSelect selectAll />
                  </Grid>
                  <Grid item xs={1}>
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
          rows={filterNodes.length && filterNodes.length < listOfNodes.length ? filterNodes : listOfNodes}
          actions={[(row) => ({
              tooltip: !row.isserver ? t('common.delete') : t('common.disabled'),
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
