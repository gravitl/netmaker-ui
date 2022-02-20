import React, { ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Tooltip } from '@mui/material'
import { Block, Check } from '@mui/icons-material'
import {
  updateNode,
} from '~modules/node/actions'
import { Node } from '~store/types'
import CustomDialog from '~components/dialog/CustomDialog'

const hoverBlueStyle = {
  ':hover': {
    color: '#3f51b5',
  },
}

export const HubButton: React.FC<{
  node: Node
  createText: string
  disabledText: string
  SignalIcon: ReactNode
  children?: ReactNode
  extraLogic?: () => void
}> = ({
  node,
  createText,
  disabledText,
  SignalIcon,
  extraLogic,
}) => {
  const dispatch = useDispatch()
  const [hovering, setHovering] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation()

  const handleHoverEnter = () => setHovering(true)
  const handleHoverLeave = () => setHovering(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const createHub = () => {
    dispatch(
    updateNode.request({
        netid: node.network,
        token: '',
        node: {
            ...node,
            ishub: true
        }
    })
    )
    if (!!extraLogic) {
      extraLogic()
    }
    handleClose()
  }

  return (
    <>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        handleAccept={createHub}
        message={node.ishub ? disabledText : createText}
        title={`${node.ishub ? t('common.disabled') : t('node.updatenode')} ${node.name}`}
      />
      <Tooltip placement="top" title={String(!node.ishub ? createText : disabledText)}>
        <span>
          <IconButton
            color={node.ishub ? 'success' : 'default'}
            sx={hoverBlueStyle}
            onClick={handleOpen}
            disabled={node.ishub}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            {!node.ishub ? SignalIcon : hovering ? <Block /> : <Check />}
          </IconButton>
        </span>
      </Tooltip>
    </>
  )
}
