import { FC, useState, useCallback, useMemo } from 'react'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { NmTable, TableColumns } from '~components/Table'
import { MultiCopy } from '~components/CopyText'
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
import { Network } from '~store/types'

interface HostNetworksTableProps {
  hostid: string
}

type HostNetworksTableData = Network & {
  addresses: Node['address'][]
  nodeId: Node['id']
  connected: Node['connected']
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
  const allNetworks = useSelector(networkSelectors.getNetworks)
  const networksMap = useMemo(
    () =>
      allNetworks.reduce((acc, net) => {
        acc[net.netid] = net
        return acc
      }, {} as { [key: Network['netid']]: Network }),
    [allNetworks]
  )

  const filteredNetworks: HostNetworksTableData[] = useMemo(() => {
    let networks: HostNetworksTableData[] = []

    const hostNetworkNodesMap: { [networkName: string]: Node } = allNodes
      .filter((node) => node.hostid === hostId)
      .reduce((acc, node) => {
        acc[node.network] = node
        return acc
      }, {} as { [networkName: string]: Node })

    if (showOnlyConnectedNets) {
      Object.values(hostNetworkNodesMap).forEach((node) => {
        if (node.connected) {
          networks.push({
            ...networksMap[node.network],
            addresses: [node.address, node.address6],
            nodeId: node.id,
            connected: node.connected,
          })
        }
      })
    } else {
      allNetworks.forEach((net) => {
        // if a node exists for the host-network pair,
        // then check the connected field
        // otherwise, there is no connection
        const node = hostNetworkNodesMap[net.netid]
        const isConnected = node?.connected ?? false

        networks.push({
          ...networksMap[net.netid],
          addresses: isConnected ? [node.address, node.address6] : [],
          nodeId: isConnected ? node.id : 'N/A',
          connected: isConnected,
        })
      })
    }

    networks = networks.filter((nw) =>
      nw.netid.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
    )
    return networks
  }, [
    allNodes,
    showOnlyConnectedNets,
    hostId,
    networksMap,
    allNetworks,
    searchFilter,
  ])

  const columns: TableColumns<HostNetworksTableData> = [
    {
      id: 'netid',
      labelKey: 'common.network',
      minWidth: 100,
      sortable: true,
      format: (value, host) => (
        <>
          <NmLink
            to={`/nodes/${encodeURIComponent(value)}/${encodeURIComponent(
              host.nodeId!
            )}`}
            sx={{ textTransform: 'none' }}
          >
            {value}
          </NmLink>
        </>
      ),
    },
    {
      id: 'addresses',
      labelKey: 'common.addresses',
      minWidth: 100,
      format: (value) => (
        <MultiCopy type="subtitle2" values={value} fullWidth={false} />
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

  const handleOpenConfirmNetStatusChangeModal = useCallback(
    (net: HostNetworksTableData) => {
      setTargetNetwork(net)
      setShouldShowConfirmNetStatusChangeModal(true)
    },
    []
  )

  const toggleNetworkStatus = useCallback(() => {
    if (!targetNetwork || !host) return
    dispatch(
      updateHostNetworks.request({
        id: host.id,
        network: targetNetwork.netid,
        action: targetNetwork.connected ? 'leave' : 'join',
      })
    )
  }, [dispatch, host, targetNetwork])

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
        message={
          (targetNetwork?.connected
            ? t('hosts.confirmdisconnect')
            : t('hosts.confirmconnect')) + `: ${targetNetwork?.netid ?? ''}`
        }
        title={`${
          targetNetwork?.connected
            ? t('hosts.disconnectfromnetwork')
            : t('hosts.connecttonetwork')
        }: ${hostsMap[hostId]?.name ?? ''}`}
      />
    </>
  )
}
