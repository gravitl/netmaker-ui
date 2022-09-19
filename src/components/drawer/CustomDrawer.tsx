import * as React from 'react'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import Wifi from '@mui/icons-material/Wifi'
import DeviceHub from '@mui/icons-material/DeviceHub'
import Devices from '@mui/icons-material/Devices'
import Language from '@mui/icons-material/Language'
import Logout from '@mui/icons-material/Logout'
import Login from '@mui/icons-material/Login'
import Info from '@mui/icons-material/Info'
import Dashboard from '@mui/icons-material/Dashboard'
import UsersIcon from '@mui/icons-material/People'
import LogsIcon from '@mui/icons-material/Terminal'
import MetricsIcon from '@mui/icons-material/Insights'
import LibraryBooks from '@mui/icons-material/LibraryBooks'
import Person from '@mui/icons-material/Person'
import VpnKey from '@mui/icons-material/VpnKey'
import { PathBreadcrumbs } from '~components/PathBreadcrumbs'
import { useTranslation } from 'react-i18next'
import { ListItemButton, Switch } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useRouteMatch, Link } from 'react-router-dom'
import { authSelectors, serverSelectors } from '../../store/selectors'
import { logout } from '../../store/modules/auth/actions'
import { NmLink } from '../../components/Link'
import { UI_VERSION } from '../../config'
import Logo from '../../netmaker-logo.png'
import DarkLogo from '../../netmaker-logo-2.png'

import { AccountTree, ViewList } from '@mui/icons-material'
import { setUserSettings } from '../../store/modules/auth/actions'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const styles = {
  topBarMain: {
    marginLeft: '1em',
    marginRight: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    flexGrow: 1,
  },
  subTitle: {
    paddingRight: '3em',
    cursor: 'pointer',
  },
  logo: {
    objectFit: 'cover',
    // height: 70,
    maxWidth: '50%',
    height: 'auto',
    width: 'auto',
    minWidth: '8em',
  } as React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >['style'],
  headerLogo: {
    width: '25%',
    height: 100,
    margin: 'auto auto',
    paddingRight: '1.5rem',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  central: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  central2: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  toolbarButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export const LoginLink: React.FC = ({ children }) => {
  let location = useLocation()

  return (
    <NmLink
      color="inherit"
      to={{
        pathname: '/login',
        // This is the trick! This link sets
        // the `background` in location state.
        state: { from: location },
      }}
    >
      {children}
    </NmLink>
  )
}

export default function CustomDrawer() {
  const match = useRouteMatch('/login')
  const showAuthButton = !match

  const user = useSelector(authSelectors.getUser)
  const userSettings = useSelector(authSelectors.getUserSettings)
  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const isLoggedIn = useSelector(authSelectors.getLoggedIn)
  const inDarkMode = useSelector(authSelectors.isInDarkMode)
  const dispatch = useDispatch()

  const { t } = useTranslation()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [clickOpen, setClickOpen] = React.useState(false)

  const location = useLocation()
  const parts = location.pathname.split('/')
  const netid = parts.length > 2 ? parts[2] : false

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleClickOpen = () => {
    setClickOpen(true)
  }

  const handleClickClose = () => {
    setClickOpen(false)
    setOpen(false)
  }

  const handleToggleMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!!userSettings) {
      dispatch(
        setUserSettings({
          ...userSettings,
          mode: inDarkMode ? 'light' : 'dark',
        })
      )
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" color="primary" open={open || clickOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleClickOpen}
            edge="start"
            sx={{
              marginRight: '36px',
              ...((open || clickOpen) && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <div style={styles.toolbarButtons}>
            <div style={styles.headerLogo}>
              <img
                style={styles.logo}
                src={inDarkMode ? DarkLogo : Logo}
                alt="Netmaker makes networks."
              />
            </div>
          </div>
        </Toolbar>
        <div style={styles.central}>
          <PathBreadcrumbs link="/" title={t('breadcrumbs.home')} />
        </div>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open || clickOpen}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <Toolbar />
        <DrawerHeader>
          <IconButton onClick={handleClickClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: 'Dashboard', icon: <Dashboard />, link: '/' },
            { text: 'Networks', icon: <Wifi />, link: '/networks' },
            {
              text: 'Nodes',
              icon: <DeviceHub />,
              link: `/nodes${!!netid ? `/${netid}` : ''}`,
            },
            {
              text: 'Graphs',
              icon: <AccountTree />,
              link: `/graphs${!!netid ? `/${netid}` : ''}`,
            },
            {
              text: 'Access Keys',
              icon: <VpnKey />,
              link: `/access-keys${!!netid ? `/${netid}` : ''}`,
            },
            {
              text: 'Ext. Clients',
              icon: <Devices />,
              link: `/ext-clients${!!netid ? `/${netid}` : ''}`,
            },
            {
              text: 'DNS',
              icon: <Language />,
              link: `/dns${!!netid ? `/${netid}` : ''}`,
            },
          ].map((item) => (
            <ListItemButton component={Link} to={item.link} key={item.text}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
        {isLoggedIn && user!.isAdmin ? (
          <>
            <Divider />
            <List>
              <ListItemButton
                component={Link}
                to={`/acls${!!netid ? `/${netid}` : ''}`}
              >
                <ListItemIcon aria-label={String(t('acls.nodes'))}>
                  <ViewList />
                </ListItemIcon>
                <ListItemText primary={t('header.acls')} />
              </ListItemButton>
              <ListItemButton component={Link} to="/users">
                <ListItemIcon aria-label={String(t('users.header'))}>
                  <UsersIcon />
                </ListItemIcon>
                <ListItemText primary={t('users.header')} />
              </ListItemButton>
              <ListItemButton component={Link} to="/logs">
                <ListItemIcon aria-label={String(t('pro.logs'))}>
                  <LogsIcon />
                </ListItemIcon>
                <ListItemText primary={t('pro.logs')} />
              </ListItemButton>
              {serverConfig.IsEE &&
                <ListItemButton component={Link} to="/metrics">
                  <ListItemIcon aria-label={String(t('pro.metrics'))}>
                    <MetricsIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('pro.metrics')} />
                </ListItemButton>
              }
            </List>
            <Divider />
          </>
        ) : null}
        <List>
          <ListItem>
            <ListItemIcon aria-label={String(t('users.header'))}>
              <Info />
            </ListItemIcon>
            <ListItemText
              primary={`UI: ${UI_VERSION}`}
              secondary={`Server: ${serverConfig.Version}`}
            />
          </ListItem>
          <ListItemButton
            component={'a'}
            href="https://docs.netmaker.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemIcon aria-label={String(t('header.docs'))}>
              <LibraryBooks />
            </ListItemIcon>
            <ListItemText primary={t('header.docs')} />
          </ListItemButton>
          {showAuthButton &&
            (isLoggedIn ? (
              <>
                <ListItemButton component={Link} to={`/users/${user!.name}`}>
                  <ListItemIcon aria-label={String(t('users.details'))}>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary={user?.name} />
                </ListItemButton>
                <ListItemButton onClick={() => dispatch(logout())}>
                  <ListItemIcon aria-label={String(t('header.logout'))}>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary={t('header.logout')} />
                </ListItemButton>
                <ListItem>
                  <ListItemIcon
                    aria-label={
                      inDarkMode
                        ? String(t('common.togglelite'))
                        : String(t('common.toggledark'))
                    }
                  >
                    <Switch onChange={handleToggleMode} checked={inDarkMode} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      inDarkMode
                        ? String(t('common.togglelite'))
                        : String(t('common.toggledark'))
                    }
                  />
                </ListItem>
              </>
            ) : (
              <ListItemButton component={Link} to="/login">
                <ListItemIcon aria-label={String(t('header.login'))}>
                  <Login />
                </ListItemIcon>
                <ListItemText primary={String(t('header.login'))} />
              </ListItemButton>
            ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, margin: '1em 0 1em 0' }}>
        <DrawerHeader />
      </Box>
    </Box>
  )
}
