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


export const HostNetworksTable: FC<Node> = ({ hostid: hostId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [targetNetwork, setTargetNetwork] = useState<Node>()
  const [showOnlyConnectedNets, setShowOnlyConnectedNets] = useState(true)
  const [searchFilter, setSearchFilter] = useState('')
  const host = useGetHostById(hostId)
  const allNodes = useSelector(nodeSelectors.getNodes)
  const hostNodes = useMemo(() => host?.nodes ?? [], [host])
  const [
    shouldShowConfirmNetStatusChangeModal,
    setShouldShowConfirmNetStatusChangeModal,
  ] = useState(false)
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
  const nodesMap = useSelector(nodeSelectors.getNodesMap)

  useLinkBreadcrumb({
    title: t('breadcrumbs.hosts'),
  })

  const filteredNetworks = useMemo(() => {
    let netsCopy: Node[] = []
    if (showOnlyConnectedNets) {
      netsCopy = JSON.parse(JSON.stringify(hostNodes))
      netsCopy.forEach((nw) => {
        nw.connected = true
      })
    } else {
      netsCopy = JSON.parse(JSON.stringify(allNodes))
      const hostNodesIds = hostNodes.map((node) => nodesMap[`${host?.id}-${node}`].id)
      netsCopy.forEach((nw) => {
        if (hostNodesIds.includes(nw.id!)) {
          nw.connected = true
        } else {
          nw.connected = false
        }
      })
    }
    netsCopy = netsCopy.filter((nw) =>
      nw.network?.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
    )
    return netsCopy
  }, [showOnlyConnectedNets, hostNodes, allNodes, nodesMap, host?.id, searchFilter])

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
        // TODO
        handleAccept={toggleNetworkStatus}
        message={t('hosts.confirmconnect')}
        title={`${t('common.connecttonetwork')}: ${hostsMap[targetNetwork!.hostid!].name ?? ''}`}
      />
    </>
  )
}
