import React from 'react'
import { NmTable, TableColumns } from '~components/Table'
import { Node } from '~modules/node'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams, Route, Switch, Link } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNodesByNetworkId } from '~util/network'
import { Button, Grid, Typography } from '@mui/material'
import { filterCustomDNSByNetwork } from '~util/node'
import { useSelector } from 'react-redux'
import { DNS, networkSelectors } from '~store/types'
import { NetworkSelect } from '~components/NetworkSelect'
import { useDispatch } from 'react-redux'
import { deleteDnsEntry } from '~store/modules/network/actions'
import { Delete } from '@mui/icons-material'
import CustomizedDialogs from '~components/dialog/CustomDialog'

const columns: TableColumns<Node> = [
  {
    id: 'name',
    labelKey: 'dns.entry',
    minWidth: 150,
    align: 'center',
    sortable: true,
    format: (_, node) => (
      <Typography variant="body1">
        {node.name}.{node.network}
      </Typography>
    ),
  },
  {
    id: 'address',
    labelKey: 'node.address',
    minWidth: 100,
    align: 'center',
    sortable: true,
  },
]

const dnsColumns: TableColumns<DNS> = [
  {
    id: 'name',
    labelKey: 'dns.entry',
    minWidth: 150,
    align: 'center',
    sortable: true,
    format: (_, entry) => (
      <Typography variant="body1">
        {entry.name}.{entry.network}
      </Typography>
    ),
  },
  {
    id: 'address',
    labelKey: 'node.address',
    minWidth: 170,
    align: 'center',
    sortable: true,
  },
]

const centerText = {
  textAlign: 'center',
}

export const DNSView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  const nodes = useNodesByNetworkId(netid)
  const currentEntries = useSelector(networkSelectors.getDnsEntries)
  const [selected, setSelected] = React.useState('')
  const dispatch = useDispatch()
  // const entries =
  const customEntries = filterCustomDNSByNetwork(
    nodes as Node[],
    currentEntries,
    netid
  )
  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

  if (!nodes) {
    return <div>{t('error.notfound')}</div>
  }

  if (!nodes.length) {
    return (
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={12} sx={{ margin: '0.5em 0em 1em 0em' }}>
          <NetworkSelect base="dns" />
        </Grid>
        <Grid item xs={12} sx={{ margin: '0.5em 0em 1em 0em' }}>
          <div style={centerText as any}>
            <h3>{t('dns.none')}</h3>
          </div>
        </Grid>
      </Grid>
    )
  }

  const handleOpen = (entryName: string) => {
    setSelected(entryName)
  }

  const handleClose = () => {
    setSelected('')
  }

  const handleDeleteEntry = () => {
    dispatch(
      deleteDnsEntry.request({
        domain: selected,
        netid,
      })
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
            <NetworkSelect base="dns" />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            sx={{ margin: '0.5em 0.5em 0.5em 0.5em' }}
          >
            <div style={centerText as any}>
              <Typography variant="h4" sx={{ marginBottom: '1em' }}>
                {`${netid} ${t('dns.default')}`}
              </Typography>
            </div>
            <NmTable
              columns={columns}
              rows={nodes}
              getRowId={(row) => row.id}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            sx={{ margin: '0.5em 0.5em 0.5em 0.5em' }}
          >
            <Grid container>
              <Grid item xs={8}>
                <div style={centerText as any}>
                  <Typography variant="h4" sx={{ marginBottom: '1em' }}>
                    {`${t('dns.custom')}`}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <Button
                  color="primary"
                  variant="contained"
                  component={Link}
                  to={`${url}/create`}
                >
                  {t('dns.create')}
                </Button>
              </Grid>
              <NmTable
                columns={dnsColumns}
                rows={customEntries}
                getRowId={(row) => row.name}
                actions={[
                  (row) => ({
                    tooltip: `${t('common.delete')} : ${row.name}.${
                      row.network
                    }`,
                    disabled: false,
                    icon: <Delete />,
                    onClick: () => {
                      handleOpen(row.name)
                    },
                  }),
                ]}
              />
              <CustomizedDialogs
                open={selected !== ''}
                handleClose={handleClose}
                handleAccept={handleDeleteEntry}
                message={t('dns.deleteconfirm')}
                title={`${t('common.delete')} ${selected}`}
              />
            </Grid>
          </Grid>
        </Grid>
      </Route>
    </Switch>
  )
}
