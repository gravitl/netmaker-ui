import React from 'react'
import { NmLink } from '~components/index'
import { NmTable, TableColumns } from '~components/Table'
import { Node } from '~modules/node'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams, Route, Switch } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNodesByNetworkId } from '~util/network'
import { NodeId } from './nodeId/NodeId'
import { Grid } from '@mui/material'

const columns: TableColumns<Node> = [
  {
    id: 'id',
    label: 'Id',
    minWidth: 170,
    sortable: true,
    format: (value, node) => (
      <NmLink
        to={`/networks/${node.network}/nodes/${encodeURIComponent(value)}`}
      >
        {value}
      </NmLink>
    ),
  },
  { id: 'name', labelKey: 'node.name', minWidth: 100, sortable: true },
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
          <Grid item>
            <h2>{t('node.nodes')}</h2>
          </Grid>
          <Grid item>
            <h2>{t('Create new')}</h2>
          </Grid>
        </Grid>
        <NmTable
          columns={columns}
          rows={listOfNodes}
          getRowId={(row) => row.id}
        />
      </Route>
      <Route path={`${path}/create`}>{/* <NetworkCreate /> */}</Route>
      <Route path={`${path}/:nodeId`}>
        <NodeId />
      </Route>
    </Switch>
  )
}
