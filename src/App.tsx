import React from 'react'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from '@mui/material/styles'
import { useCurrentTheme } from './components/theme'
import { useSelector, useDispatch } from 'react-redux'
import { authSelectors, nodeSelectors, aclSelectors } from '~store/types'
import { logout } from '~store/modules/auth/actions'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

import Routes from './route/root'
import { PathBreadcrumbsProvider } from './components/PathBreadcrumbs'
import { getNodes } from '~store/modules/node/actions'
import { getHosts } from '~store/modules/hosts/actions'

function App() {
  const dispatch = useDispatch()
  const user = useSelector(authSelectors.getUser)
  const token = useSelector(authSelectors.getToken)
  const isLoggedIn = useSelector(authSelectors.getLoggedIn)
  const shouldSignOut = useSelector(nodeSelectors.getShouldSignOut)
  const currentACL = useSelector(aclSelectors.getCurrentACL)
  const userSettings = useSelector(authSelectors.getUserSettings)

  React.useEffect(() => {
    const interval = setInterval(() => {
      
      if (!isLoggedIn || (!!user && Date.now() / 1000 > user.exp && !window.location.href.includes('/login'))) {
        dispatch(logout())
      } else if (shouldSignOut) {
        dispatch(logout())
      } else if (isLoggedIn && token && user && user.isAdmin) {
        dispatch(getNodes.request({ token }))
        dispatch(getHosts.request())
      }
      
    }, 7500)
    return () => clearInterval(interval)
  }, [dispatch, user, isLoggedIn, token, shouldSignOut, currentACL])

  const theme = useCurrentTheme(userSettings.mode || 'dark')

  return (
    <React.StrictMode>
      <PathBreadcrumbsProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Routes />
            <ToastContainer containerId="App.tsx" />
          </LocalizationProvider>
        </ThemeProvider>
      </PathBreadcrumbsProvider>
    </React.StrictMode>
  )
}

export default App
