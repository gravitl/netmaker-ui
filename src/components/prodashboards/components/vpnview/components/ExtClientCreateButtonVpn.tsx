import React from 'react'
import { AddCircleOutline } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { i18n } from '../../../../../i18n/i18n'
import { createExternalClient } from '~store/modules/node/actions'
import { Node, proSelectors } from '~store/types'
import { useParams } from 'react-router-dom'

export const ExtClientCreateButtonVpn: React.FC<{
  node: Node
}> = ({ node }) => {
  const dispatch = useDispatch()
  const userData = useSelector(proSelectors.networkUserData)
  const { netid } = useParams<{ netid: string }>()

  const data = userData[netid]

  const clientCount = data.clients.length
  const clientsLeft = data.user.clientlimit - clientCount

  const handleExtClientCreate = () => {
    dispatch(
      createExternalClient.request({
        netid: node.network,
        nodeid: node.id,
      })
    )
  }

  return (
    <Tooltip title={i18n.t('extclient.create') as string} placement="top">
      <IconButton
        color="primary"
        onClick={handleExtClientCreate}
        disabled={clientsLeft === 0}
      >
        <AddCircleOutline />
      </IconButton>
    </Tooltip>
  )
}
