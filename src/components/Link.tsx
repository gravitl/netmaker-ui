import React, { useCallback } from 'react'
import { LinkProps, useHistory, useLocation } from 'react-router-dom'
import { Button, ButtonProps } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

export const NmLink: React.FC<
  Exclude<LinkProps, 'component'> & ButtonProps & { sx?: SxProps<Theme> }
> = ({ sx, to, children, ...rest }) => {
  const history = useHistory()
  const location = useLocation()
  const navigate = useCallback(() => {
    history.push(typeof to === 'function' ? to(location) : to)
  }, [to, location, history])

  return (
    <Button {...rest} sx={sx} onClick={navigate}>
      {children}
    </Button>
  )
}
