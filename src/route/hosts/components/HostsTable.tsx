import { FC, useState, useCallback } from 'react'
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

export const HostsTable: FC<{ hosts: Host[] }> = ({ hosts }) => {
  const { t } = useTranslation()
  // const dispatch = useDispatch()
  // const [selected, setSelected] = useState({} as Host)

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

  const toggleDefaultness = useCallback((host: Host) => {}, [])

  return (
    <>
      <NmTable
        columns={columns}
        rows={hosts}
        getRowId={(host) => host.id}
        actions={[
          (host) => ({
            tooltip: host.isdefault
              ? t('hosts.removedefault')
              : t('hosts.makedefault'),
            disabled: false,
            icon: host.isdefault ? <CheckCircle /> : <RadioButtonUnchecked />,
            onClick: () => {
              toggleDefaultness(host)
            },
          }),
        ]}
      />

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
