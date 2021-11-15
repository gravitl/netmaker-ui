import React from 'react'
import { Download, QrCode2 } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { i18n } from '../../../i18n/i18n'
import { getExternalClientConf } from '~store/modules/node/actions'
import { authSelectors, ExternalClient } from '~store/types'
import { useHistory, useRouteMatch } from 'react-router'

export const DownloadExtClientButton: React.FC<{
  client: ExternalClient
  type: 'qr' | 'file'
}> = ({ client, type }) => {
  const dispatch = useDispatch()
  const token = useSelector(authSelectors.getToken)
  const history = useHistory()
  const { url } = useRouteMatch()

  const handleDownloadConf = () => {
    dispatch(
      getExternalClientConf.request({
        clientid: client.clientid,
        netid: client.network,
        type,
        token: token || '',
      })
    )

    if (type === 'qr') {
      history.push(`${url}/${client.clientid}/qr`)
    }
  }

  return (
    <Tooltip
      title={`${
        type === 'file'
          ? i18n.t('extclient.download')
          : i18n.t('extclient.viewqr')
      } ${client.clientid}`}
      placement="top"
    >
      <IconButton onClick={handleDownloadConf}>
        {type === 'file' ? <Download /> : <QrCode2 />}
      </IconButton>
    </Tooltip>
  )
}
