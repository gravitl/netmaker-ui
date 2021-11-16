import React from 'react'
import { NmTable, TableColumns } from '~components/Table'
import { ExternalClient, Node } from '~modules/node'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams, Route, Switch } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNodesByNetworkId } from '~util/network'
import { Grid, Typography } from '@mui/material'
import { i18n } from '../../../i18n/i18n'
import { filterExtClientsByNetwork, filterIngressGateways } from '~util/node'
import { useSelector } from 'react-redux'
import { ExtClientCreateButton } from './ExtClientCreateButton'
import { nodeSelectors } from '~store/types'
import { DownloadExtClientButton } from './DownloadExtClientButton'
import { DeleteExtClientButton } from './DeleteExtClientButton'
import { EditExtClientButton } from './EditExtClientButton'
import { NetworkSelect } from '~components/NetworkSelect'

const columns: TableColumns<Node> = [
  {
    id: 'name',
    labelKey: 'ingress.name',
    minWidth: 150,
    align: 'center',
    sortable: true,
  },
  {
    id: 'address',
    labelKey: 'node.address',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'id',
    label: i18n.t('ingress.add'),
    minWidth: 50,
    align: 'center',
    format: (_, node) => <ExtClientCreateButton node={node} />,
  },
]

const extColumns: TableColumns<ExternalClient> = [
  {
    id: 'clientid',
    labelKey: 'extclient.clientid',
    minWidth: 150,
    align: 'center',
    sortable: true,
    format: (_, client) => <EditExtClientButton client={client} />,
  },
  {
    id: 'address',
    labelKey: 'node.address',
    minWidth: 170,
    align: 'center',
    sortable: true,
  },
  {
    id: 'network',
    labelKey: 'extclient.qr',
    minWidth: 50,
    align: 'center',
    format: (_, client) => (
      <DownloadExtClientButton type="qr" client={client} />
    ),
  },
  {
    id: 'description',
    labelKey: 'extclient.download',
    minWidth: 50,
    align: 'center',
    format: (_, client) => (
      <DownloadExtClientButton type="file" client={client} />
    ),
  },
  {
    id: 'lastmodified',
    labelKey: 'common.delete',
    minWidth: 50,
    align: 'center',
    format: (_, client) => <DeleteExtClientButton client={client} />,
  },
]

const centerText = {
  textAlign: 'center',
}

export const ExtClientView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const extClients = useSelector(nodeSelectors.getExtClients)
  const { netid } = useParams<{ netid: string }>()
  const clients = filterExtClientsByNetwork(extClients, netid)
  console.log(clients)
  const listOfNodes = useNodesByNetworkId(netid)

  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

  if (!listOfNodes) {
    return <div>{t('error.notfound')}</div>
  }

  const gateways = filterIngressGateways(listOfNodes)

  if (!gateways.length) {
    return (
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={12} sx={{ margin: '0.5em 0em 1em 0em' }}>
          <NetworkSelect base="ext-clients" />
        </Grid>
        <Grid item xs={12} sx={{ margin: '0.5em 0em 1em 0em' }}>
          <div style={centerText as any}>
            <h3>{t('ingress.none')}</h3>
          </div>
        </Grid>
      </Grid>
    )
  }

  return (
    <Switch>
      <Route exact path={path}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={12} sx={{ margin: '0.5em 0em 1em 0em' }}>
            <NetworkSelect base="ext-clients" />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            sx={{ margin: '0.5em 0.5em 0.5em 0.5em' }}
          >
            <div style={centerText as any}>
              <Typography variant="h4" sx={{ marginBottom: '1em' }}>
                {`${netid} ${t('ingress.gateways')}`}
              </Typography>
            </div>
            <NmTable
              columns={columns}
              rows={gateways}
              getRowId={(row) => row.id}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={7}
            sx={{ margin: '0.5em 0.5em 0.5em 0.5em' }}
          >
            <div style={centerText as any}>
              <Typography variant="h4" sx={{ marginBottom: '1em' }}>
                {t('ingress.clients')}
              </Typography>
            </div>
            <NmTable
              columns={extColumns}
              rows={clients}
              getRowId={(row) => row.clientid}
            />
          </Grid>
        </Grid>
      </Route>
    </Switch>
  )
}
