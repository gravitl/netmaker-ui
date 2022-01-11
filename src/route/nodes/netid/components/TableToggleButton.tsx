import React, { ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Tooltip } from '@mui/material'
import { Block, Check } from '@mui/icons-material'
import {
  deleteIngressNode,
  deleteEgressNode,
  createIngressNode,
  deleteRelayNode,
} from '~modules/node/actions'
import { Node } from '~store/types'
import { Link } from 'react-router-dom'
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

export const TableToggleButton: React.FC<{
  which: 'egress' | 'ingress' | 'relay'
  isOn: boolean
  node: Node
  createText: string
  removeText: string
  SignalIcon: ReactNode
  children?: ReactNode
  withHistory?: boolean
}> = ({
  which,
  node,
  isOn,
  createText,
  removeText,
  SignalIcon,
  withHistory,
}) => {
  const dispatch = useDispatch()
  const [hovering, setHovering] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation()

  const handleHoverEnter = () => setHovering(true)
  const handleHoverLeave = () => setHovering(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const removeAction = (which: string) => {
    switch (which) {
      case 'egress':
        dispatch(
          deleteEgressNode.request({
            netid: node.network,
            nodeid: node.id,
          })
        )
        break
      case 'ingress':
        dispatch(
          deleteIngressNode.request({
            netid: node.network,
            nodeid: node.id,
          })
        )
        break
      case 'relay':
        dispatch(
          deleteRelayNode.request({
            netid: node.network,
            nodeid: node.id,
          })
        )
        break
    }
  }

  const createIngress = () => {
    if (which === 'ingress') {
      dispatch(
        createIngressNode.request({
          netid: node.network,
          nodeid: node.id,
        })
      )
    }
  }

  return (
    <>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        handleAccept={() => (isOn ? removeAction(which) : createIngress())}
        message={isOn ? removeText : createText}
        title={`${isOn ? t('common.delete') : t('common.create')} ${which}`}
      />
      <Tooltip placement="top" title={String(!isOn ? createText : removeText)}>
        {withHistory && !isOn ? (
          <IconButton
            color={isOn ? 'success' : 'default'}
            sx={isOn ? hoverRedStyle : hoverBlueStyle}
            component={Link}
            onClick={!isOn ? () => {} : handleOpen}
            to={`/nodes/${node.network}/${node.id}/create-${which}`}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            disabled={which === 'relay' && node.isrelayed}
          >
            {!isOn ? SignalIcon : hovering ? <Block /> : <Check />}
          </IconButton>
        ) : (
          <IconButton
            color={isOn ? 'success' : 'default'}
            sx={isOn ? hoverRedStyle : hoverBlueStyle}
            onClick={handleOpen}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            {!isOn ? SignalIcon : hovering ? <Block /> : <Check />}
          </IconButton>
        )}
      </Tooltip>
    </>
  )
}
