import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Tooltip } from '@mui/material'
import { Block, Check, AirlineStops } from '@mui/icons-material'
import {
  createIngressNode, deleteIngressNode,
} from '~modules/node/actions'
import { Node } from '~store/types'
import CustomDialog from '~components/dialog/CustomDialog'

const hoverRedStyle = {
  ':hover': {
    color: 'red',
  },
}

const hoverBlueStyle = {
  ':hover': {
    color: '#3f51b5',
  },
}

export const FailoverButton: React.FC<{
  node: Node
}> = ({
  node,
}) => {
  const dispatch = useDispatch()
  const [hovering, setHovering] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation()

  const handleHoverEnter = () => setHovering(true)
  const handleHoverLeave = () => setHovering(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const createIngress = () => {
    dispatch(
        createIngressNode.request({
            netid: node.network,
            nodeid: node.id,
            failover: true,
        })
    )
  }

  const removeAction = () => {
    dispatch(
        deleteIngressNode.request({
            netid: node.network,
            nodeid: node.id,
        })
    )
  }

  return (
    <>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        handleAccept={() => (!node.failover ? createIngress() : removeAction())}
        message={`${t('pro.helpers.failover')}`}
        title={`${!node.failover ? t('common.create') : t('common.delete')} ${t('node.failover')}`}
      />
      <Tooltip title={`${!node.failover ? t('common.create') : t('common.delete')} ${t('node.failover')}`} placement='top' >
            <IconButton
                color={node.failover ? 'success' : 'default'}
                sx={node.failover ? hoverRedStyle : hoverBlueStyle}
                onClick={handleOpen}
                onMouseEnter={handleHoverEnter}
                onMouseLeave={handleHoverLeave}
            >
                {!node.failover ? <AirlineStops /> : hovering ? <Block /> : <Check />}
            </IconButton>
        </Tooltip>
    </>
  )
}
