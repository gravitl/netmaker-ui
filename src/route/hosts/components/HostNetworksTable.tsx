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
import { useDispatch, useSelector } from 'react-redux'
import { nodeSelectors } from '~store/selectors'
import { Button, Grid, Switch as SwitchField, TextField } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useGetHostById } from '~util/hosts'
import CustomizedDialogs from '~components/dialog/CustomDialog'


type HostNetwork = Partial<Node> & {
  server: string
  isConnected: boolean
}

interface HostNetworksTableProps {
  hostId: Host['id']
}


export const HostNetworksTable: FC<HostNetworksTableProps> = ({ hostId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [targetNetwork, setTargetNetwork] = useState<HostNetwork>()
  const [showOnlyConnectedNets, setShowOnlyConnectedNets] = useState(true)
  const [searchFilter, setSearchFilter] = useState('')
  const host = useGetHostById(hostId)
  const allNodes = useSelector(nodeSelectors.getNodes)
  const hostNodes = useMemo(() => host?.nodes ?? [], [host])
  const [
    shouldShowConfirmNetStatusChangeModal,
    setShouldShowConfirmNetStatusChangeModal,
  ] = useState(false)

  useLinkBreadcrumb({
    title: t('breadcrumbs.hosts'),
  })

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
    (net: HostNetwork) => {
      setTargetNetwork(net)
      setShouldShowConfirmNetStatusChangeModal(true)
    },
    []
  )

  const onChangeConnectionStatus = useCallback(() => {
    if (!targetNetwork) return
    // TODO: get all connected net names
    // dispatch(updateHostNetworks)
  },
  [targetNetwork])

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
        // handleAccept={toggleNetworkStatus}
        handleAccept={() => {}}
        message={t('hosts.confirmconnect')}
        title={`${t('common.connecttonetwork')}: ${targetNetwork?.name ?? ''}`}
      />
    </>
  )
}
