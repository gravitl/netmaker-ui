import React from 'react'
import { AddCircleOutline } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useDispatch } from 'react-redux'
import { i18n } from '../../../i18n/i18n'
import { createExternalClient } from '~store/modules/node/actions'
import { Node } from '~store/types'

export const ExtClientCreateButton: React.FC<{
    node: Node
  }> = ({ node }) => {
    const dispatch = useDispatch()

    const handleExtClientCreate = () => {
        dispatch(createExternalClient.request({
            netid: node.network,
            nodeid: node.macaddress,
        }))
    }
    
    return <Tooltip title={(i18n.t('extclient.create') as string)} placement='top'>
        <IconButton color='primary' onClick={handleExtClientCreate}>
            <AddCircleOutline />
        </IconButton>
    </Tooltip>
}
