import { FC, useState, useCallback, useMemo, FormEvent } from 'react'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
// import { useDispatch } from 'react-redux'
import { NmTable, TableColumns } from '~components/Table'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
// import CustomizedDialogs from '~components/dialog/CustomDialog'
import CopyText from '~components/CopyText'
// import { useSelector } from 'react-redux'
// import { serverSelectors } from '~store/selectors'
import { Host } from '~store/modules/hosts/types'
import { Node } from '~store/modules/node/types'
import { useSelector } from 'react-redux'
import { nodeSelectors } from '~store/selectors'
import { Button, Grid, Switch as SwitchField, TextField } from '@mui/material'

const mockHost: Host = {
  id: 'hostid0',
  name: 'host-zero',
  version: 'v0.18.0',
  os: 'linux',
  isdefault: true,
  localaddress: '10.0.236.23',
  nodes: [
    {
      id: 'ed2d1c93-f879-4b94-a62b-6557c4cfde8e',
      network: 'testnet',
    },
    {
      id: '358e6623-d668-48c5-b2ca-5925c5f22d6d',
      network: 'virt-net',
    },
  ],
} as unknown as Host

type HostNetwork = Partial<Node> & {
  server: string
  isConnected: boolean
}

export const HostNetworksTable: FC<{ hostId: string }> = ({ hostId }) => {
  const { t } = useTranslation()
  // const dispatch = useDispatch()
  // const [selected, setSelected] = useState({} as Host)
  const [showOnlyConnectedNets, setShowOnlyConnectedNets] = useState(true)
  const [searchFilter, setSearchFilter] = useState('')
  // TODO: load from store
  const host = mockHost
  // TODO: load from store
  const allNodes = useSelector(nodeSelectors.getNodes)
  const hostNodes = useMemo(() => host.nodes, [host])
  const filteredNetworks = useMemo(() => {
    let netsCopy: HostNetwork[] = []
    if (showOnlyConnectedNets) {
      netsCopy = JSON.parse(JSON.stringify(hostNodes))
      netsCopy.forEach((nw) => {
        nw.isConnected = true
      })
    } else {
      netsCopy = JSON.parse(JSON.stringify(allNodes))
      const hostNodesIds = hostNodes.map((node) => node.id)
      netsCopy.forEach((nw) => {
        if (hostNodesIds.includes(nw.id!)) {
          nw.isConnected = true
        } else {
          nw.isConnected = false
        }
      })
    }
    netsCopy = netsCopy.filter((nw) =>
      nw.network?.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
    )
    return netsCopy
  }, [allNodes, hostNodes, showOnlyConnectedNets, searchFilter])

  useLinkBreadcrumb({
    title: t('breadcrumbs.hosts'),
  })

  const columns: TableColumns<HostNetwork> = [
    {
      id: 'network',
      labelKey: 'common.network',
      minWidth: 100,
      sortable: true,
      format: (value, host) => (
        <>
          <NmLink
            to={`/nodes/${encodeURIComponent(
              host.network!
            )}/${encodeURIComponent(host.id!)}`}
            sx={{ textTransform: 'none' }}
          >
            {value}
          </NmLink>
        </>
      ),
    },
    {
      id: 'server',
      labelKey: 'common.server',
      minWidth: 100,
      sortable: true,
      // format: (value, host) => (
      //   <>
      //     <NmLink
      //       to={`/hosts/${encodeURIComponent(host.id)}`}
      //       sx={{ textTransform: 'none' }}
      //     >
      //       {value}
      //     </NmLink>
      //   </>
      // ),
    },
    {
      id: 'localaddress',
      labelKey: 'hosts.localaddress',
      minWidth: 100,
      format: (value, nw) => (
        <CopyText type="subtitle2" value={nw.localaddress!} />
      ),
    },
    {
      id: 'isConnected',
      labelKey: 'common.isconnected',
      minWidth: 50,
      align: 'center',
      format: (value, nw) => (
        <SwitchField
          checked={nw.isConnected}
          onClick={() => onChangeConnectionStatus(nw)}
        />
      ),
    },
  ]

  // const handleClose = () => {
  //   setSelected({} as Host)
  // }

  // const handleOpen = (host: Host) => {
  //   setSelected(host)
  // }

  // const handleDeleteHost = () => {
  //   if (selected.name) {
  //     dispatch(
  //       deleteHost.request({
  //         hostId: selected.id,
  //       })
  //     )
  //     handleClose()
  //   }
  // }

  const onChangeConnectionStatus = useCallback((hostNetwork: HostNetwork) => {},
  [])

  return (
    <>
      <Grid container>
        {/* filters row */}
        <Grid item xs={12} style={{ marginBottom: '1rem' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setShowOnlyConnectedNets(!showOnlyConnectedNets)
              setSearchFilter('')
            }}
          >
            {showOnlyConnectedNets
              ? 'Show all networks'
              : 'Show only connected networks'}
          </Button>
        </Grid>

        {/* search row */}
        <Grid item xs={12} style={{ marginBottom: '1rem' }}>
          <TextField
            fullWidth
            size="small"
            label={t('common.search')}
            placeholder={t('common.searchbyname')}
            value={searchFilter}
            onInput={(ev: any) => setSearchFilter(ev.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <NmTable
            columns={columns}
            rows={filteredNetworks}
            getRowId={(nw) => nw.id!}
            // actionsHeader={{ element: 'Connected', width: 150 }}
            // actions={[
            //   (nw) => ({
            //     tooltip: nw.isConnected
            //       ? t('common.shouldconnect')
            //       : t('common.shoulddisconnect'),
            //     disabled: false,
            //     icon: nw.isConnected ? (
            //       <CheckCircle color="success" />
            //     ) : (
            //       <RadioButtonUnchecked />
            //     ),
            //     onClick: () => {
            //       onChangeConnectionStatus(nw)
            //     },
            //   }),
            // ]}
          />
        </Grid>
      </Grid>

      {/* <CustomizedDialogs
        open={!!selected.name}
        handleClose={handleClose}
        handleAccept={handleDeleteHost}
        message={t('node.deleteconfirm')}
        title={`${t('common.delete')} ${selected.name}`}
      /> */}
    </>
  )
}
