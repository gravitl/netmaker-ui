import { FC, useState, useCallback, useMemo } from 'react'
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
import { Grid, TextField } from '@mui/material'

interface HostsTableProps {
  hosts: Host[]
  onToggleDefaultness: (host: Host) => void
}

export const HostsTable: FC<HostsTableProps> = (props) => {
  const { t } = useTranslation()
  const [searchFilter, setSearchFilter] = useState('')

  useLinkBreadcrumb({
    title: t('breadcrumbs.hosts'),
  })

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
      id: 'localaddress',
      labelKey: 'hosts.localaddress',
      minWidth: 100,
      format: (value) => <CopyText type="subtitle2" value={value} />,
    },
    {
      id: 'version',
      labelKey: 'common.version',
      minWidth: 50,
      align: 'center',
      format: (value, host) => (
        <>
          {value ? value : 'N/A'} {host.os ? `(${host.os})` : ''}
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
          actionsHeader={{ element: 'Set Default Node', width: 150 }}
          actions={[
            (host) => ({
              tooltip: host.isdefault
                ? t('hosts.removedefault')
                : t('hosts.makedefault'),
              disabled: false,
              icon: host.isdefault ? (
                <CheckCircle color="success" />
              ) : (
                <RadioButtonUnchecked />
              ),
              onClick: () => {
                toggleDefaultness(host)
              },
            }),
          ]}
        />
      )}
    </>
  )
}
