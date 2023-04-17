import React from 'react'
import { useDispatch } from 'react-redux'
import { NmLink } from '~components/Link'
import { Network } from '../../../store/modules/network'
import { datePickerConverter } from '../../../util/unixTime'
import { NmTable, TableColumns } from '~components/Table'
import { Delete } from '@mui/icons-material'
import CopyText from '~components/CopyText'

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
    format: (value) => (
      <NmLink sx={{ textTransform: 'none' }} to={`/networks/${value}`}>
        {value}
      </NmLink>
    ),
  },
  {
    id: 'addressrange',
    labelKey: 'network.addressrange',
    minWidth: 100,
    sortable: true,
    format: (value) => <CopyText value={value} type="subtitle2" />,
  },
  {
    id: 'addressrange6',
    labelKey: 'network.addressrange6',
    minWidth: 100,
    sortable: true,
    format: (value) => <CopyText value={value} type="subtitle2" />,
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

export const NetworkTable: React.FC<{ networks: Network[] }> = ({
  networks,
}) => {
  // const networks = useSelector(networkSelectors.getNetworks)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [selectedNet, setSelectedNet] = React.useState('')
  const [refresh, setRefresh] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = (selected: string, toRefresh: boolean) => {
    setSelectedNet(selected)
    setRefresh(toRefresh)
    setOpen(true)
  }

  const handleAccept = () => {
    if (refresh) {
      handlePubKeyRefresh(selectedNet)
    } else {
      handleDeleteNetwork(selectedNet)
    }
  }

  const handleDeleteNetwork = (network: string) => {
    dispatch(
      deleteNetwork.request({
        netid: selectedNet,
      })
    )
  }

  const handlePubKeyRefresh = (network: string) => {
    dispatch(
      refreshPublicKeys.request({
        netid: network,
      })
    )
  }

  return (
    <>
      <hr />
      <NmTable
        columns={columns}
        rows={networks}
        getRowId={(row) => row.netid}
        actions={[
          (row) => ({
            tooltip: t('common.delete'),
            disabled: false,
            icon: <Delete />,
            onClick: () => {
              handleOpen(row.netid, false)
            },
          }),
        ]}
      />
      {selectedNet && (
        <CustomDialog
          open={open}
          handleClose={handleClose}
          handleAccept={handleAccept}
          message={
            refresh ? t('network.refreshconfirm') : t('network.deleteconfirm')
          }
          title={`${
            refresh ? t('network.refresh') : t('common.delete')
          } ${selectedNet}`}
        />
      )}
    </>
  )
}
