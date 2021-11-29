import React from 'react'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from '@mui/material/styles'
import { useCurrentTheme } from './components/theme'
import { useSelector, useDispatch } from 'react-redux'
import { authSelectors } from '~store/types'
import { logout } from '~store/modules/auth/actions'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

import Routes from './route/root'
import { PathBreadcrumbsProvider } from './components/PathBreadcrumbs'

function App() {

  const dispatch = useDispatch()
  const user = useSelector(authSelectors.getUser)

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!!user && Date.now() / 1000 > user.exp && !window.location.href.includes('/login')) {
        dispatch(logout())
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [dispatch, user])

  const theme = useCurrentTheme()

  return (
    <PathBreadcrumbsProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Routes />
          <ToastContainer containerId="App.tsx" />
        </LocalizationProvider>
      </ThemeProvider>
    </PathBreadcrumbsProvider>
  )
}

export default App
