import { FC, useState, useCallback, useMemo } from 'react'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { NmTable, TableColumns } from '~components/Table'
import { useDispatch, useSelector } from 'react-redux'
import { hostsSelectors } from '~store/selectors'
import {
  Button,
  Grid,
  Switch as SwitchField,
  TextField,
  Tooltip,
} from '@mui/material'
import { useGetHostById } from '~util/hosts'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { deleteHostRelay, updateHost } from '~store/modules/hosts/actions'
import { Host } from '~store/types'

interface HostRelayTableProps {
  hostid: string
}

type HostRelayTableData = Host & {
  isRelayed: boolean
}

export const HostRelayTable: FC<HostRelayTableProps> = ({ hostid: hostId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [targetHost, setTargetHost] = useState<HostRelayTableData>()
  const [showOnlyRelayedHosts, setShowOnlyRelayedHosts] = useState(true)
  const [searchFilter, setSearchFilter] = useState('')
  const host = useGetHostById(hostId)
  const allHosts = useSelector(hostsSelectors.getHosts)
  const [
    shouldShowConfirmRelayStatusChangeModal,
    setShouldShowConfirmNetStatusChangeModal,
  ] = useState(false)
  const hostsMap = useSelector(hostsSelectors.getHostsMap)

  const isRelayingTo = useCallback(
    (h?: Host) => {
      if (!h) return false
      return host?.relay_hosts.includes(h.id) ?? false
    },
    [host?.relay_hosts]
  )

  const filteredHosts: HostRelayTableData[] = useMemo(() => {
    let hosts: HostRelayTableData[] = []
    const relayedHosts = allHosts
      .filter((h) => isRelayingTo(h))
      .map(h => ({
        ...h,
        isRelayed: true,
      }))

    hosts = relayedHosts

    if (!showOnlyRelayedHosts) {
      allHosts
        .filter((h) => !(h.isrelay || h.isrelayed))
        .forEach((h) => {
          hosts.push({
            ...h,
            isRelayed: isRelayingTo(h),
          })
        })
    }

    hosts = hosts.filter(
      (h) =>
        h.id !== hostId &&
        h.name.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
    )
    return hosts
  }, [allHosts, hostId, isRelayingTo, searchFilter, showOnlyRelayedHosts])

  const columns: TableColumns<HostRelayTableData> = [
    {
      id: 'id',
      labelKey: 'hosts.relayedhost',
      minWidth: 100,
      sortable: true,
      format: (value, host) => (
        <>
          <NmLink
            to={`/hosts/${encodeURIComponent(value)}`}
            sx={{ textTransform: 'none' }}
          >
            {hostsMap[value]?.name ?? ''} ({value})
          </NmLink>
        </>
      ),
    },
    {
      id: 'isRelayed',
      labelKey: 'hosts.relayed',
      minWidth: 50,
      align: 'center',
      format: (value, h) => (
        <Tooltip title={String(t('hosts.canonlyrelaynonrelayedhosts'))}>
          <SwitchField
            disabled={h.isrelay && h.relay_hosts.includes(hostId)}
            checked={isRelayingTo(h)}
            onClick={() => handleOpenConfirmRelayStatusChangeModal(h)}
          />
        </Tooltip>
      ),
    },
  ]

  const handleCloseConfirmRelayStatusChangeModal = useCallback(() => {
    setTargetHost(undefined)
    setShouldShowConfirmNetStatusChangeModal(false)
  }, [])

  const handleOpenConfirmRelayStatusChangeModal = useCallback(
    (net: HostRelayTableData) => {
      setTargetHost(net)
      setShouldShowConfirmNetStatusChangeModal(true)
    },
    []
  )

  const toggleRelayStatus = useCallback(() => {
    if (!targetHost || !host) return
    const relayedHostsIds = new Set(host.relay_hosts)

    // if relayed, stop. else relay
    if (isRelayingTo(targetHost)) {
      relayedHostsIds.delete(targetHost.id)
    } else {
      relayedHostsIds.add(targetHost.id)
    }

    // if there are no more hosts to relay, delete the relay host
    if (relayedHostsIds.size > 0) {
      dispatch(
        updateHost.request({
          ...host,
          relay_hosts: [...relayedHostsIds],
        })
      )
    } else {
      dispatch(
        deleteHostRelay.request({
          hostid: host.id,
        })
      )
    }
  }, [dispatch, host, isRelayingTo, targetHost])

  return (
    <>
      <Grid container>
        {/* filters row */}
        <Grid item xs={12} style={{ marginBottom: '1rem' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setShowOnlyRelayedHosts(!showOnlyRelayedHosts)
              setSearchFilter('')
            }}
          >
            {showOnlyRelayedHosts
              ? t('hosts.showallrelayablehosts')
              : t('hosts.showonlyrelayedhosts')}
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
            rows={filteredHosts}
            getRowId={(h) => h.id}
          />
        </Grid>
      </Grid>

      <CustomizedDialogs
        open={shouldShowConfirmRelayStatusChangeModal}
        handleClose={handleCloseConfirmRelayStatusChangeModal}
        handleAccept={toggleRelayStatus}
        message={
          (isRelayingTo(targetHost)
            ? t('hosts.confirmremoverelayto')
            : t('hosts.confirmrelayto')) +
          `: ${targetHost?.name + '(' + targetHost?.id + ')' ?? ''}`
        }
        title={`${
          isRelayingTo(targetHost)
            ? t('hosts.removerelayto')
            : t('hosts.relayto')
        }: ${hostsMap[hostId]?.name ?? ''}`}
      />
    </>
  )
}
