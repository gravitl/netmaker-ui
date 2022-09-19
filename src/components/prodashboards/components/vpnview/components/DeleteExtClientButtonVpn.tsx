import React from 'react'
import { Delete } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useDispatch } from 'react-redux'
import { i18n } from '../../../../../i18n/i18n'
import { deleteExternalClient } from '~store/modules/node/actions'
import { ExternalClient } from '~store/types'
import CustomizedDialogs from '~components/dialog/CustomDialog'

export const DeleteExtClientButtonVpn: React.FC<{
  client: ExternalClient
}> = ({ client }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)

  const handleDeleteClient = () => {
    dispatch(
      deleteExternalClient.request({
        clientName: client.clientid,
        netid: client.network,
      })
    )
  }

  const handleClose = () => setOpen(false)

  const handleOpen = () => setOpen(true)

  return (
    <>
      <CustomizedDialogs
        open={open}
        handleClose={handleClose}
        handleAccept={handleDeleteClient}
        message={i18n.t('extclient.deleteconfirm')}
        title={`${i18n.t('common.delete')} ${client.clientid}`}
      />
      <Tooltip
        title={`${i18n.t('common.delete')} ${client.clientid}`}
        placement="top"
      >
        <IconButton onClick={handleOpen}>
          <Delete />
        </IconButton>
      </Tooltip>
    </>
  )
}
