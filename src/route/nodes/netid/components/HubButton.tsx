import React, { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Tooltip } from '@mui/material'
// import { Block, Check } from '@mui/icons-material'
import {
  updateNode,
} from '~modules/node/actions'
import { hostsSelectors, Node } from '~store/types'
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
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
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
        message={createText}
        title={`${t('node.updatenode')} ${hostsMap[node.hostid].name}`}
      />
      <Tooltip placement="top" title={String(createText)}>
        <span>
          <IconButton
            color={'default'}
            sx={hoverBlueStyle}
            onClick={handleOpen}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            {SignalIcon}
          </IconButton>
        </span>
      </Tooltip>
    </>
  )
}
