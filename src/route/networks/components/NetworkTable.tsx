import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { networkSelectors } from '../../../store/selectors'
import { NmLink } from '../../../components'
import { Network } from '../../../store/modules/network'
import { datePickerConverter } from '../../../util/unixTime'
import { NmTable, TableColumns } from '../../../components/Table'
import { Autorenew, Delete } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  deleteNetwork,
  refreshPublicKeys,
} from '../../../store/modules/network/actions'
import CustomDialog from '~components/dialog/CustomDialog'

const columns: TableColumns<Network> = [
  {
    id: 'netid',
    label: 'NetId',
    minWidth: 170,
    sortable: true,
    format: (value) => <NmLink to={`/networks/${value}`}>{value}</NmLink>,
  },
  {
    id: 'displayname',
    labelKey: 'network.displayname',
    minWidth: 100,
    sortable: true,
  },
  {
    id: 'addressrange',
    labelKey: 'network.addressrange',
    minWidth: 150,
    sortable: true,
  },
  {
    id: 'networklastmodified',
    labelKey: 'network.networklastmodified',
    minWidth: 170,
    align: 'right',
    format: (value) => datePickerConverter(value),
  },
  {
    id: 'nodeslastmodified',
    labelKey: 'network.nodeslastmodified',
    minWidth: 170,
    align: 'right',
    format: (value) => datePickerConverter(value),
  },
]

export const NetworkTable: React.FC = () => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [selectedNet, setSelectedNet] = React.useState('')

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = (selected: string) => {
    setSelectedNet(selected)
    setOpen(true)
  }

  const handleDeleteNetwork = () => {
    dispatch(
      deleteNetwork.request({
        netid: selectedNet,
      })
    )
  }

  const handlePubKeyRefresh = (network: Network) => {
    dispatch(
      refreshPublicKeys.request({
        netid: network.netid,
      })
    )
  }

  return (
    <>
      <NmTable
        columns={columns}
        rows={listOfNetworks}
        getRowId={(row) => row.netid}
        actions={[
          (row) => ({
            tooltip: `${t('network.refresh')} : ${row.displayname}`,
            disabled: false,
            icon: <Autorenew />,
            onClick: () => {
              handlePubKeyRefresh(row)
            },
          }),
          (row) => ({
            tooltip: t('common.delete'),
            disabled: false,
            icon: <Delete />,
            onClick: () => {
              handleOpen(row.netid)
            },
          }),
        ]}
      />
      {selectedNet && (
        <CustomDialog
          open={open}
          handleClose={handleClose}
          handleAccept={handleDeleteNetwork}
          message={t('network.deleteconfirm')}
          title={`${t('common.delete')} ${selectedNet}`}
        />
      )}
    </>
  )
}
