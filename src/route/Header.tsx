import React, { useCallback } from 'react'
import {
  AppBar,
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import Logo from '../netmaker.png'
import Info from '@mui/icons-material/Info'
import { UI_VERSION } from '../config'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { authSelectors, serverSelectors } from '../store/selectors'
import { logout } from '../store/modules/auth/actions'
import { NmLink } from '../components'
import { PathBreadcrumbs } from '../components/PathBreadcrumbs'

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
    width: '50%',
    height: '100%',
    minWidth: '2em',
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
} as any

interface LoginLinkProps {
  children: any
  setOpen: () => void
}

export const LoginLink: React.FC<LoginLinkProps> = ({ children, setOpen }) => {
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

interface ToggleProps {
  DrawerHandler: () => void
  open: boolean
}

export function Header(Props: ToggleProps) {
  const { t } = useTranslation()

  const match = useRouteMatch('/login')
  const showAuthButton = !match

  const user = useSelector(authSelectors.getUser)
  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const isLoggedIn = useSelector(authSelectors.getLoggedIn)
  const dispatch = useDispatch()

  const history = useHistory()

  const tabChange = useCallback(
    (value: string) => {
      if (history.location.pathname !== value) history.push(value)
    },
    [history]
  )

  const tabValue = `/${history.location.pathname.split('/')[1]}`

  return (
    <div style={{ overflowY: 'hidden' }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Grid container style={styles.topBarMain}>
          <AppBar position="static">
            <Toolbar>
              <Button
                color="inherit"
                href={'https://docs.netmaker.org'}
                target="_blank"
              >
                {t('header.docs')}
              </Button>
              {isLoggedIn && user!.isAdmin ? (
                <Button
                  style={{ marginLeft: '1em' }}
                  color="inherit"
                  // onClick={() => setCreatingUser(true)}
                >
                  {t('header.users')}
                </Button>
              ) : null}
              <div style={styles.central}>
                <Typography variant="h3" style={styles.title}>
                  <img
                    style={styles.logo}
                    src={Logo}
                    alt="Netmaker makes networks."
                  />
                </Typography>
              </div>
              {showAuthButton &&
                (isLoggedIn ? (
                  <>
                    <Typography
                      component="p"
                      style={styles.subTitle}
                      // onClick={() => setIsUpdatingUser(true)}
                    >
                      <strong>{user!.name}</strong>
                    </Typography>
                    <Button color="inherit" onClick={() => dispatch(logout())}>
                      {t('header.logout')}
                    </Button>
                  </>
                ) : (
                  <LoginLink setOpen={Props.DrawerHandler}>
                    {t('header.login')}
                  </LoginLink>
                ))}
            </Toolbar>
          </AppBar>
          {isLoggedIn ? (
            <AppBar position="relative" color="default">
              <Tabs
                value={tabValue !== '/' ? tabValue : '/networks'}
                centered
                aria-label="main table"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  label={String(t('header.networks'))}
                  tabIndex={0}
                  value="/networks"
                  onClick={() => tabChange('/networks')}
                />
                <Tab
                  label={String(t('header.nodes'))}
                  tabIndex={1}
                  value="/nodes"
                  onClick={() => tabChange('/nodes')}
                />
                <Tab
                  label={String(t('header.accessKeys'))}
                  tabIndex={2}
                  value="/keys"
                  onClick={() => tabChange('/keys')}
                />
                <Tab
                  label={
                    'DNS' + serverConfig.DNSMode
                      ? `${t('header.dns')} (${t('common.disabled')})`
                      : t('header.dns')
                  }
                  tabIndex={3}
                  disabled={serverConfig.DNSMode}
                  value="/dns"
                  onClick={() => tabChange('/dns')}
                />
                <Tab
                  label={String(t('header.externalClients'))}
                  tabIndex={4}
                  value="/external"
                  onClick={() => tabChange('/external')}
                />
                <Box style={styles.central2}>
                  <Tooltip
                    title={
                      serverConfig.Version
                        ? `${t('common.version')} ${t('common.server')}: ${
                            serverConfig.Version
                          }, UI: ${UI_VERSION}`
                        : `${t('common.version')} ${t('common.server')}: ${t(
                            'common.notFound'
                          )}, UI: ${UI_VERSION}`
                    }
                    placement="bottom"
                  >
                    <Info color="primary" />
                  </Tooltip>
                </Box>
              </Tabs>
            </AppBar>
          ) : null}

          <AppBar position="relative" color="default">
            <PathBreadcrumbs link="/" title={t('breadcrumbs.home')} />
          </AppBar>
        </Grid>
      </Box>
    </div>
  )
}
