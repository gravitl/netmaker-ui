import React from 'react'
import { Download } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { i18n } from '../../../i18n/i18n'
import { getExternalClientConf } from '~store/modules/node/actions'
import { authSelectors, ExternalClient } from '~store/types'

export const DownloadExtClientButton: React.FC<{
    client: ExternalClient
  }> = ({ client }) => {
    const dispatch = useDispatch()
    const token = useSelector(authSelectors.getToken)
    
    const handleDownloadConf = () => {
        dispatch(getExternalClientConf.request({
            clientid: client.clientid,
            netid: client.network,
            type: 'file',
            token: token || '',
        }))
    }

    return <Tooltip title={`${i18n.t('extclient.download')} ${client.clientid}`} placement='top'>
        <IconButton onClick={handleDownloadConf}>
            <Download />
        </IconButton>
    </Tooltip>
}
