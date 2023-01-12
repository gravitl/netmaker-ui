import { FC, useState, useCallback, useMemo } from 'react'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { NmTable, TableColumns } from '~components/Table'
import CopyText from '~components/CopyText'
import { Host } from '~store/modules/hosts/types'
import { Grid, Switch, TextField, Typography } from '@mui/material'
import CustomizedDialogs from '~components/dialog/CustomDialog'

interface HostsTableProps {
  hosts: Host[]
  onToggleDefaultness: (host: Host) => void
}

export const HostsTable: FC<HostsTableProps> = (props) => {
  const { t } = useTranslation()
  const [searchFilter, setSearchFilter] = useState('')
  const [shouldShowConfirmDefaultModal, setShouldShowConfirmDefaultModal] =
    useState(false)
  const [targetHost, setTargetHost] = useState<Host | null>(null)
  const columns: TableColumns<Host> = [
    {
      id: 'name',
      labelKey: 'common.name',
      minWidth: 100,
      sortable: true,
      format: (value, host) => (
        <>
          <NmLink
            to={`/hosts/${encodeURIComponent(host.id)}`}
            sx={{ textTransform: 'none' }}
          >
            {value}
          </NmLink>
        </>
      ),
    },
    {
      id: 'endpointip',
      labelKey: 'hosts.endpointip',
      minWidth: 100,
      format: (value) => <CopyText type="subtitle2" value={value} />,
    },
    {
      id: 'publickey',
      labelKey: 'hosts.publickey',
      minWidth: 100,
      format: (value) => <CopyText type="subtitle2" value={value} />,
    },
    {
      id: 'isrelay',
      labelKey: 'hosts.relaystatus',
      minWidth: 100,
      format: (value, host) => (
        <>
          <Typography variant="overline" color={host.isrelay ? 'green' : ''}>
            {host.isrelay ? <span>&#10003;</span> : <span>&times;</span>}{' '}
            Relaying
          </Typography>
          <br />
          <Typography variant="overline" color={host.isrelayed ? 'green' : ''}>
            {host.isrelayed ? <span>&#10003;</span> : <span>&times;</span>}{' '}
            Relayed
          </Typography>
        </>
      ),
    },
    {
      id: 'version',
      labelKey: 'common.version',
      minWidth: 50,
      align: 'center',
      format: (value, host) => (
        <>
          {value ? value : 'N/A'}{' '}
          {host.os ? `(${host.os === 'darwin' ? 'mac' : host.os})` : ''}
        </>
      ),
    },
  ]

  const filteredHosts = useMemo(() => {
    return props.hosts.filter((host) =>
      host.name.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
    )
  }, [props.hosts, searchFilter])

  const toggleDefaultness = useCallback(
    (host: Host) => {
      props.onToggleDefaultness(host)
    },
    [props]
  )

  const openConfirmDefaultModal = useCallback((host: Host) => {
    setTargetHost(host)
    setShouldShowConfirmDefaultModal(true)
  }, [])

  const hideConfirmDefaultModal = useCallback(() => {
    setShouldShowConfirmDefaultModal(false)
  }, [])

  return (
    <>
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

      {props.hosts.length === 0 ? (
        <div>{t('hosts.nohostconnected')}</div>
      ) : (
        <NmTable
          columns={columns}
          rows={filteredHosts}
          getRowId={(host) => host.id}
          actionsHeader={{ element: 'Default Node', width: 150 }}
          actions={[
            (host) => ({
              tooltip: host.isdefault
                ? t('hosts.removedefault')
                : t('hosts.makedefault'),
              disabled: false,
              icon: <Switch checked={host.isdefault} />,
              onClick: () => {
                openConfirmDefaultModal(host)
              },
            }),
          ]}
        />
      )}

      {/* modals */}
      {!!targetHost ? (
        <CustomizedDialogs
          open={shouldShowConfirmDefaultModal}
          handleClose={hideConfirmDefaultModal}
          handleAccept={() => toggleDefaultness(targetHost)}
          message={
            targetHost.isdefault
              ? t('hosts.removedefaultness')
              : t('hosts.adddefaultness')
          }
          title={t('hosts.confirmdefaultness')}
        />
      ) : null}
    </>
  )
}
