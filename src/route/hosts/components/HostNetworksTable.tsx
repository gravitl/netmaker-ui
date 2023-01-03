import { FC, useState, useCallback, useMemo } from 'react'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
// import { useDispatch } from 'react-redux'
import { NmTable, TableColumns } from '~components/Table'
// import CustomizedDialogs from '~components/dialog/CustomDialog'
import CopyText from '~components/CopyText'
// import { useSelector } from 'react-redux'
// import { serverSelectors } from '~store/selectors'
import { Node } from '~store/modules/node/types'
import { useDispatch, useSelector } from 'react-redux'
import {
  hostsSelectors,
  networkSelectors,
  nodeSelectors,
} from '~store/selectors'
import { Button, Grid, Switch as SwitchField, TextField } from '@mui/material'
import { useGetHostById } from '~util/hosts'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { updateHostNetworks } from '~store/modules/hosts/actions'
import { Host, Network } from '~store/types'

interface HostNetworksTableProps {
  hostid: string
}

type HostNetworksTableData = Network & {
  localaddress: Node['localaddress']
  nodeId: Node['id']
  connected: Node['connected']
  hostid: Host['id']
}

export const HostNetworksTable: FC<HostNetworksTableProps> = ({
  hostid: hostId,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [targetNetwork, setTargetNetwork] = useState<HostNetworksTableData>()
  const [showOnlyConnectedNets, setShowOnlyConnectedNets] = useState(true)
  const [searchFilter, setSearchFilter] = useState('')
  const host = useGetHostById(hostId)
  const allNodes = useSelector(nodeSelectors.getNodes)
  const [
    shouldShowConfirmNetStatusChangeModal,
    setShouldShowConfirmNetStatusChangeModal,
  ] = useState(false)
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
  const nodesMap = useSelector(nodeSelectors.getNodesMap)
  const allNetworks = useSelector(networkSelectors.getNetworks)
  const networksMap = useMemo(
    () =>
      allNetworks.reduce((acc, net) => {
        acc[net.netid] = net
        return acc
      }, {} as { [key: Network['netid']]: Network }),
    [allNetworks]
  )

  useLinkBreadcrumb({
    title: t('breadcrumbs.hosts'),
  })

  // TODO: change implementation to show Network instead of Node
  const filteredNetworks: HostNetworksTableData[] = useMemo(() => {
    let networks: HostNetworksTableData[] = []
    let nodes: Node[] = []
    const cache = new Set<Network['netid']>()

    if (showOnlyConnectedNets) {
      allNodes.forEach((node) => {
        if (node.hostid === hostId && node.connected) {
          nodes.push(node)
        }
      })
    } else {
      nodes = allNodes
    }

    nodes.forEach((node) => {
      if (!cache.has(node.network)) {
        networks.push({
          ...networksMap[node.network],
          localaddress: node.localaddress,
          netid: node.network,
          nodeId: node.id,
          connected: node.connected,
          hostid: node.hostid,
        })
        cache.add(node.network)
      }
    })

    networks = networks.filter((nw) =>
      nw.netid.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
    )
    return networks
  }, [showOnlyConnectedNets, allNodes, hostId, networksMap, searchFilter])

  const columns: TableColumns<HostNetworksTableData> = [
    {
      id: 'netid',
      labelKey: 'common.network',
      minWidth: 100,
      sortable: true,
      format: (value, host) => (
        <>
          <NmLink
            to={`/nodes/${encodeURIComponent(value)}/${encodeURIComponent(host.nodeId!)}`}
            sx={{ textTransform: 'none' }}
          >
            {value}
          </NmLink>
        </>
      ),
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
      id: 'connected',
      labelKey: 'common.connected',
      minWidth: 50,
      align: 'center',
      format: (value, nw) => (
        <SwitchField
          checked={nw.connected}
          onClick={() => handleOpenConfirmNetStatusChangeModal(nw)}
        />
      ),
    },
  ]

  const handleCloseConfirmNetStatusChangeModal = useCallback(() => {
    setTargetNetwork(undefined)
    setShouldShowConfirmNetStatusChangeModal(false)
  }, [])

  const handleOpenConfirmNetStatusChangeModal = useCallback((net: HostNetworksTableData) => {
    setTargetNetwork(net)
    setShouldShowConfirmNetStatusChangeModal(true)
  }, [])

  const toggleNetworkStatus = useCallback(() => {
    if (!targetNetwork || !host) return
    const connectedNodesNames = new Set(
      host.nodes.map((nId) => nodesMap[nId].network)
    )
    // if connected, disconnect. else connect
    if (targetNetwork.connected) {
      connectedNodesNames.delete(targetNetwork.netid)
    } else {
      connectedNodesNames.add(targetNetwork.netid)
    }
    dispatch(
      updateHostNetworks.request({
        id: host.id,
        networks: [...connectedNodesNames],
      })
    )
  }, [dispatch, host, nodesMap, targetNetwork])

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
            getRowId={(nw) => nw.netid!}
          />
        </Grid>
      </Grid>

      <CustomizedDialogs
        open={shouldShowConfirmNetStatusChangeModal}
        handleClose={handleCloseConfirmNetStatusChangeModal}
        handleAccept={toggleNetworkStatus}
        message={t('hosts.confirmconnect')}
        title={`${t('common.connecttonetwork')}: ${
          hostsMap[targetNetwork?.hostid ?? '']?.name ?? ''
        }`}
      />
    </>
  )
}
