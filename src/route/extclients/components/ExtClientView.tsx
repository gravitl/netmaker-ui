import React from 'react'
import { useDispatch } from 'react-redux'
import { NmTable, TableColumns } from '~components/Table'
import { ExternalClient, Node } from '~modules/node'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams, Route, Switch, Link } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNodesByNetworkId } from '~util/network'
import { Button, Grid, Typography } from '@mui/material'
import { i18n } from '../../../i18n/i18n'
import { filterExtClientsByNetwork, filterIngressGateways } from '~util/node'
import { useSelector } from 'react-redux'
import { ExtClientCreateButton } from './ExtClientCreateButton'
import { hostsSelectors, nodeSelectors } from '~store/types'
import { DownloadExtClientButton } from './DownloadExtClientButton'
import { DeleteExtClientButton } from './DeleteExtClientButton'
import { EditExtClientButton } from './EditExtClientButton'
import { NetworkSelect } from '~components/NetworkSelect'
import {
  CheckBox,
  CheckBoxOutlineBlank,
  Check,
  Block,
} from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { updateExternalClient } from '~store/modules/node/actions'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { MultiCopy } from '~components/CopyText'
import { NotFound } from '~util/errorpage'
import { serverSelectors } from '~store/types'

const centerText = {
  textAlign: 'center',
}

export const ExtClientView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const extClients = useSelector(nodeSelectors.getExtClients)
  const { netid } = useParams<{ netid: string }>()
  var clients = filterExtClientsByNetwork(extClients, netid)
  const listOfNodes = useNodesByNetworkId(netid)
  const [filterClients, setFilterClients] = React.useState(
    [] as ExternalClient[]
  )
  const [selectedClient, setSelectedClient] = React.useState(
    {} as ExternalClient | null
  )
  const dispatch = useDispatch()
  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const hostsMap = useSelector(hostsSelectors.getHostsMap)

  const columns: TableColumns<Node> = [
    {
      id: 'id',
      labelKey: 'ingress.name',
      minWidth: 125,
      align: 'center',
      sortable: true,
      format(_, node) {
        return `${hostsMap[node.hostid]?.name ?? ''} (${node.server}/${node.network})`
      }
    },
    {
      id: 'address',
      labelKey: 'node.addresses',
      minWidth: 90,
      align: 'center',
      format: (_, node) => (
        <MultiCopy type="subtitle2" values={[node.address, node.address6]} />
      ),
    },
    {
      id: 'id',
      label: i18n.t('ingress.add'),
      minWidth: 45,
      align: 'center',
      format: (_, node) => <ExtClientCreateButton node={node} />,
    },
  ]

  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

  if (!listOfNodes) {
    return <NotFound />
  }

  const gateways = filterIngressGateways(listOfNodes)

  if (!!!gateways.length) {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={8} sx={{ margin: '0.5em 0em 1em 0em' }}>
          <NetworkSelect />
        </Grid>
        <Grid item xs={12} sx={{ margin: '0.5em 0em 1em 0em' }}>
          <div style={centerText as any}>
            <h3>{t('ingress.none')}</h3>
          </div>
        </Grid>
      </Grid>
    )
  }

  const extColumns: TableColumns<ExternalClient> = [
    {
      id: 'clientid',
      labelKey: 'extclient.clientid',
      minWidth: 124,
      align: 'center',
      sortable: true,
      format: (_, client) => <EditExtClientButton client={client} />,
    },
    {
      id: 'address',
      labelKey: 'node.addresses',
      minWidth: 80,
      align: 'center',
      sortable: true,
      format: (_, node) => (
        <MultiCopy type="subtitle2" values={[node.address, node.address6]} />
      ),
    },
    {
      id: 'network',
      labelKey: 'extclient.qr',
      minWidth: 40,
      align: 'center',
      format: (_, client) => (
        <DownloadExtClientButton type="qr" client={client} />
      ),
    },
    {
      id: 'description',
      labelKey: 'extclient.download',
      minWidth: 40,
      align: 'center',
      format: (_, client) => (
        <DownloadExtClientButton type="file" client={client} />
      ),
    },
    {
      id: 'enabled',
      labelKey: 'extclient.enabled',
      minWidth: 40,
      align: 'center',
      format: (_, client) => (
        <Tooltip
          title={`${
            client.enabled ? t('common.disable') : t('common.enable')
          } ${client.clientid}`}
          placement="top"
        >
          <IconButton onClick={() => handleSelect(client)}>
            {client.enabled ? (
              <Check htmlColor="#2b00ff" />
            ) : (
              <Block color="error" />
            )}
          </IconButton>
        </Tooltip>
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

  const handleSelect = (client: ExternalClient) => {
    setSelectedClient(client)
  }

  const handleClose = () => {
    setSelectedClient(null)
  }

  const changeAccessExtClient = () => {
    if (!!selectedClient && !!selectedClient.clientid) {
      dispatch(
        updateExternalClient.request({
          clientName: selectedClient.clientid,
          netid: selectedClient.network,
          newClientName: selectedClient.clientid,
          enabled: !selectedClient.enabled,
        })
      )
    }
  }

  const isChecked = (id: string) => {
    const index = filterClients.findIndex((s) => s.ingressgatewayid === id)
    return !!!~index
  }

  const handleChecked = (id: string, checked: boolean) => {
    if (!checked) {
      setFilterClients([
        ...filterClients.filter((client) => client.ingressgatewayid !== id),
      ])
    } else {
      setFilterClients([
        ...filterClients,
        ...clients.filter((client) => client.ingressgatewayid === id),
      ])
    }
  }

  return (
    <Switch>
      <Route exact path={path}>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
        >
          <Grid item xs={8} sx={{ margin: '0.5em 0em 1em 0em' }}>
              <NetworkSelect />
          </Grid>
          {serverConfig.IsEE && 
            <Grid item xs={6}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Button
                  variant='outlined' 
                  component={Link}
                  to={`/ec/metrics/${netid}`} 
                  sx={{marginLeft: '1rem', width: '50%'}}>
                  {t('pro.metrics')}
                </Button>
              </div>
            </Grid>
            }
          <Grid item xs={12}>
            <hr />
            <CustomizedDialogs
              open={!!selectedClient && !!selectedClient.clientid}
              handleClose={handleClose}
              handleAccept={changeAccessExtClient}
              message={t('extclient.changeconfirm')}
              title={`${
                selectedClient?.enabled
                  ? t('common.disable')
                  : t('common.enable')
              } ${selectedClient?.clientid}`}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            sx={{ margin: '0.5rem 0.1rem 0.5rem 0.1rem' }}
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
              actions={[
                (row) => ({
                  tooltip: t('ingress.view'),
                  disabled: !!!clients.filter(
                    (s) => s.ingressgatewayid === row.id
                  ).length,
                  icon: isChecked(row.id) ? (
                    <CheckBox />
                  ) : (
                    <CheckBoxOutlineBlank />
                  ),
                  onClick: () => {
                    handleChecked(row.id, isChecked(row.id))
                  },
                }),
              ]}
              tableId="_gateways"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6.5}
            sx={{ margin: '0.5rem 0.1rem 0.5rem 0.1rem' }}
          >
            <div style={centerText as any}>
              <Typography variant="h4" sx={{ marginBottom: '1em' }}>
                {t('ingress.clients')}
              </Typography>
            </div>
            <NmTable
              columns={extColumns}
              rows={clients.filter((client) => {
                return !!!~filterClients.findIndex(
                  (c) => c.clientid === client.clientid
                )
              })}
              getRowId={(row) => row.clientid}
              tableId="_extClients"
            />
          </Grid>
        </Grid>
      </Route>
    </Switch>
  )
}
