import React from 'react'
import { useDispatch } from 'react-redux'
import { NmTable, TableColumns } from '~components/Table'
import { ExternalClient, Node } from '~modules/node'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams, Route, Switch } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { Grid, Typography } from '@mui/material'
import { i18n } from '../../../../../i18n/i18n'
import { useSelector } from 'react-redux'
import { ExtClientCreateButtonVpn } from './ExtClientCreateButtonVpn'
import { proSelectors } from '~store/types'
import { DownloadExtClientButtonVpn } from './DownloadExtClientButtonVpn'
import { DeleteExtClientButtonVpn } from './DeleteExtClientButtonVpn'
import { EditExtClientButtonVpn } from './EditExtClientButtonVpn'
import Avatar from '@mui/material/Avatar'

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
// import { tempClients, tempNodes } from './testdata'
import { grey } from '@mui/material/colors'
import { GenericError } from '~util/genericerror'
import { useHistory } from 'react-router-dom'

const columns: TableColumns<Node> = [
  {
    id: 'name',
    labelKey: 'ingress.name',
    minWidth: 125,
    align: 'center',
    sortable: true,
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
    format: (_, node) => <ExtClientCreateButtonVpn node={node} />,
  },
]

const centerText = {
  textAlign: 'center',
}

export const ExtClientViewVpn: React.FC<{
  vpns: Node[]
  clients: ExternalClient[]
}> = ({ vpns, clients }) => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const history = useHistory()
  const [filterClients, setFilterClients] = React.useState(
    [] as ExternalClient[]
  )
  const [selectedClient, setSelectedClient] = React.useState(
    {} as ExternalClient | null
  )
  const dispatch = useDispatch()
  const userData = useSelector(proSelectors.networkUserData)
  const data = userData[netid]

  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

  if (!vpns || !vpns.length) {
    return <GenericError message={t('ingress.none')} />
  }

  const extColumns: TableColumns<ExternalClient> = [
    {
      id: 'clientid',
      labelKey: 'extclient.clientid',
      minWidth: 124,
      align: 'center',
      sortable: true,
      format: (_, client) => <EditExtClientButtonVpn client={client} />,
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
        <DownloadExtClientButtonVpn type="qr" client={client} />
      ),
    },
    {
      id: 'description',
      labelKey: 'extclient.download',
      minWidth: 40,
      align: 'center',
      format: (_, client) => (
        <DownloadExtClientButtonVpn type="file" client={client} />
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
      format: (_, client) => <DeleteExtClientButtonVpn client={client} />,
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
      history.push(`/prouser/${netid}/vpnview`)
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

  //get the number of clients for this user
  const clientCount = data.clients.length
  //subtract the number of clients for this user from the total number of clients
  const clientsLeft = data.user.clientlimit - clientCount

  return (
    <Switch>
      <Route exact path={path}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={4}>
            <Avatar
              sx={{
                bgcolor: grey[700],
                width: 100,
                height: 100,
              }}
              aria-label={String(t('common.clientsused'))}
            >
              <Typography
                variant="body1"
                style={{ fontSize: '.9em', textAlign: 'center' }}
              >
                {String(t('common.clientsused'))}
                {clientCount}
              </Typography>
            </Avatar>
          </Grid>
          <Grid item xs={1}>
            <Avatar
              sx={{ bgcolor: grey[700], width: 100, height: 100 }}
              aria-label={String(t('common.clientsavailable'))}
            >
              <Typography
                variant="body1"
                style={{ fontSize: '.9em', textAlign: 'center' }}
              >
                {String(t('common.clientsavailable'))}
                {clientsLeft}
              </Typography>
            </Avatar>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
        >
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
              rows={vpns}
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
