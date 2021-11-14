import React from 'react'
import { NmLink } from '~components/index'
import { NmTable, TableColumns } from '~components/Table'
import { Node } from '~modules/node'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams, Route, Switch } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNodesByNetworkId } from '~util/network'
import { NodeId } from './nodeId/NodeId'
import { Chip, Grid, Typography } from '@mui/material'
import { encode64 } from '~util/fields'
import { AltRoute, CallMerge, CallSplit } from '@mui/icons-material'
import { i18n } from '../../../../i18n/i18n'
import { CreateEgress } from './components/CreateEgress'
import { TableToggleButton } from './components/TableToggleButton'
import { CreateRelay } from './components/CreateRelay'
import { NetworkSelect } from '../../../../components/NetworkSelect'

const columns: TableColumns<Node> = [
  { id: 'name',
    labelKey: 'node.name',
    minWidth: 100,
    sortable: true,
    format: (value, node) => (
      <NmLink
        to={`/networks/${node.network}/nodes/${encodeURIComponent(encode64(node.id))}`}
      >
        {value}
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
    format: (value) => <NmLink to={`/networks/${value}`}>{value}</NmLink>,
  },
  {
    id: 'isegressgateway',
    labelKey: 'node.statusegress',
    minWidth: 30,
    align: 'center',
    format: (isegress, row) =>
    <TableToggleButton 
      which='egress'
      isOn={isegress}
      node={row}
      createText={`${i18n.t('node.createegress')} : ${row.name}`}
      removeText={`${i18n.t('node.removeegress')} : ${row.name}`}
      SignalIcon={<CallSplit />}
      withHistory
    />
  },
  {
    id: 'isingressgateway',
    labelKey: 'node.statusingress',
    minWidth: 30,
    align: 'center',
    format: (isingress, row) =>
    <TableToggleButton 
      which='ingress'
      isOn={isingress}
      node={row}
      createText={`${i18n.t('node.createingress')} : ${row.name}`}
      removeText={`${i18n.t('node.removeingress')} : ${row.name}`}
      SignalIcon={<CallMerge />}
    />
  },
  {
    id: 'isrelay',
    labelKey: 'node.statusrelay',
    minWidth: 30,
    align: 'center',
    format: (isrelay, row) =>
      <TableToggleButton 
        which='relay'
        isOn={isrelay}
        node={row}
        createText={`${i18n.t('node.createrelay')} : ${row.name}`}
        removeText={`${i18n.t('node.removerelay')} : ${row.name}`}
        SignalIcon={<AltRoute />}
        withHistory
      />
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

export const NetworkNodes: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()

  const { networkId } = useParams<{ networkId: string }>()
  const listOfNodes = useNodesByNetworkId(networkId)

  useLinkBreadcrumb({
    link: url,
    title: t('breadcrumbs.nodes'),
  })

  if (!listOfNodes) {
    return <div>Not Found</div>
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
            <Grid container justifyContent='space-between' alignItems='center'>
              <Grid item xs={4}>
                <Typography variant='h4'>
                  {`${networkId} ${t('node.nodes')}`}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <NetworkSelect base='networks' extension='nodes'/>
              </Grid>
          </Grid>
          </Grid>
        </Grid>
        <NmTable
          columns={columns}
          rows={listOfNodes}
          getRowId={(row) => row.id}
        />
      </Route>
      <Route path={`${path}/:nodeId/create-egress`} children={<CreateEgress />} />
      <Route path={`${path}/:nodeId/create-relay`} children={<CreateRelay />} />
      <Route path={`${path}/:nodeId`}>
        <NodeId />
      </Route>
    </Switch>
  )
}
