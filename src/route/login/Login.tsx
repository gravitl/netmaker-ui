import React from 'react'
import { useSelector } from 'react-redux'
import { Modal, Box, useTheme } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { authSelectors } from '../../store/selectors'
import LoginView from '../../components/views/Login'
import CreateAdminView from '../../components/views/CreateAdmin'

const styles = {
  centerText: {
    textAlign: 'center',
  },
  vertTabs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  mainContainer: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    display: 'flex',
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '1px solid #000',
    minWidth: '33%',
    // boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  },
} as any

export function Login() {
  const history = useHistory()
  const hasAdmin = useSelector(authSelectors.hasAdmin)
  const theme = useTheme()

  const authRenderSwitch = () => {
    if (hasAdmin) return <LoginView />
    return <CreateAdminView />
  }

  return (
      <Modal
        style={{ display: 'flex', flex: 1}}
        open={true}
        onClose={() => {
          history.goBack()
        }}
      >
        <Box style={{...styles.modal, backgroundColor: theme.palette.background.paper }}>{authRenderSwitch()}</Box>
      </Modal>
  )
}
