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
import { hostsSelectors, nodeSelectors } from '~store/selectors'
import { Button, Grid, Switch as SwitchField, TextField } from '@mui/material'
import { useGetHostById } from '~util/hosts'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { updateHostNetworks } from '~store/modules/hosts/actions'

interface HostNetworksTableProps {
  hostid: string
}

export const HostNetworksTable: FC<HostNetworksTableProps> = ({ hostid: hostId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [targetNetwork, setTargetNetwork] = useState<Node>()
  const [showOnlyConnectedNets, setShowOnlyConnectedNets] = useState(true)
  const [searchFilter, setSearchFilter] = useState('')
  const host = useGetHostById(hostId)
  const allNodes = useSelector(nodeSelectors.getNodes)
  const hostNodesNames = useMemo(() => host?.nodes ?? [], [host])
  const [
    shouldShowConfirmNetStatusChangeModal,
    setShouldShowConfirmNetStatusChangeModal,
  ] = useState(false)
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
  const nodesMap = useSelector(nodeSelectors.getNodesMap)

  useLinkBreadcrumb({
    title: t('breadcrumbs.hosts'),
  })

  // TODO: change implementation to show Network instead of Node
  const filteredNetworks = useMemo(() => {
    let nodes: Node[] = []
    if (showOnlyConnectedNets) {
      allNodes.forEach(node => {
        if (node.hostid === hostId && node.connected) {
          nodes.push(node)
        }
      })
    } else {
      nodes = allNodes
    }
    nodes = nodes.filter((nw) =>
      nw.network?.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
    )
    return nodes
  }, [showOnlyConnectedNets, allNodes, hostId, searchFilter])

  const columns: TableColumns<Node> = [
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

  const handleOpenConfirmNetStatusChangeModal = useCallback(
    (net: Node) => {
      setTargetNetwork(net)
      setShouldShowConfirmNetStatusChangeModal(true)
    },
    []
  )

  const toggleNetworkStatus = useCallback(() => {
    if (!targetNetwork || !host) return
    const connectedNodesNames = new Set(host.nodes.map(n => nodesMap[`${host?.id}-${n}`].network))
    // if connected, disconnect. else connect
    if (targetNetwork.connected) {
      connectedNodesNames.delete(targetNetwork.network)
    } else {
      connectedNodesNames.add(targetNetwork.network)
    }
    dispatch(updateHostNetworks.request({ id: host.id, networks: [...connectedNodesNames] }))
  },
  [dispatch, host, nodesMap, targetNetwork])

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
          />
        </Grid>
      </Grid>

      <CustomizedDialogs
        open={shouldShowConfirmNetStatusChangeModal}
        handleClose={handleCloseConfirmNetStatusChangeModal}
        handleAccept={toggleNetworkStatus}
        message={t('hosts.confirmconnect')}
        title={`${t('common.connecttonetwork')}: ${hostsMap[targetNetwork?.hostid ?? '']?.name ?? ''}`}
      />
    </>
  )
}
