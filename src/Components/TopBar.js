import { AppBar, Tabs, Tab, Box, Grid, Button, Toolbar, Typography, } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Info from '@material-ui/icons/Info'
import USER from '../Components/Utils/User'
import Logo from '../netmaker.png'

const NETWORK_DETAIL_TAB_NAME = 'network details'
const NODE_DETAIL_TAB_NAME = 'nodes'
const OTK_DETAIL_TAB_NAME = 'access keys'
const DNS_DETAIL_TAB_NAME = 'dns'
const EXTERNAL_CLIENTS_TAB_NAME = 'external clients'
const VERSION_TAB_NAME = "version"
// == set UI version here ==
const UI_VERSION = "0.7.2"

// function getWindowDimensions() {
//     const { innerWidth: width, innerHeight: height } = window;
//     return {
//       width,
//       height
//     };
//   }

const useStyles = makeStyles(theme => ({ 
    topBarMain: {
        marginLeft: '1em',
        marginRight: '1em'
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        textAlign: 'center',
        flexGrow: 1,
    }, 
    title2: {
        textAlign: 'center',
        flexGrow: 1,
    }, 
    subTitle: {
        paddingRight: '3em',
        cursor: 'pointer'
    },
    logo: {
        objectFit: "cover",
        width: "50%",
        height: "100%",
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
}))

export default function TopBar({setDataSelection, currentUser, setUser, setIsLoggingIn, setIsUpdatingUser, configDetails, setCreatingUser, setError}) {

    const classes = useStyles()

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
      setDataSelection(newValue);
    };

    const IS_DNS_DISABLED = configDetails.DNSMode === 'off'
    // const IS_EXT_DISABLED = configDetails.EXTClients === 'off'

    return (
        <Box display='flex' alignItems='center' justifyContent='center'>
            <Grid container className={classes.topBarMain}>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" href={'https://docs.netmaker.org'} target='_blank'>Docs</Button>
                    {currentUser && currentUser.isadmin ? 
                        <Button style={{marginLeft: '1em'}} color="inherit" onClick={() => setCreatingUser(true)}>Users</Button> : null
                    }
                    <div className={classes.central}>
                        <Typography variant="h3" className={classes.title} onClick={() => window.location.reload()}>
                            <img className={classes.logo} src={Logo} alt='Netmaker makes networks.' />
                        </Typography>
                    </div>
                    {currentUser ? 
                        <>
                            <Typography variant="p" className={classes.subTitle} onClick={() => setIsUpdatingUser(true)}>
                                <strong>{currentUser.username}</strong>
                            </Typography>
                            <Button color="inherit" onClick={() => USER.logout(setUser, setIsLoggingIn)}>Logout</Button>
                    </> : <Button color="inherit" onClick={() => {setError(''); setIsLoggingIn(true);}}>Login</Button>
                    }
                </Toolbar>
            </AppBar>
            {currentUser ? 
            <AppBar position='relative' color='default'>
                <Tabs 
                    value={value}
                    centered
                    aria-label="main table"
                    textColor='primary'
                    indicatorColor='primary'
                    onChange={handleChange}
                >
                    <Tab label={NETWORK_DETAIL_TAB_NAME} tabIndex={0} />
                    <Tab label={NODE_DETAIL_TAB_NAME} tabIndex={1} />
                    <Tab label={OTK_DETAIL_TAB_NAME} tabIndex={2} />
                    <Tab label={IS_DNS_DISABLED ? `${DNS_DETAIL_TAB_NAME} (DISABLED)` : DNS_DETAIL_TAB_NAME} tabIndex={3} disabled={IS_DNS_DISABLED}/>
                    <Tab label={EXTERNAL_CLIENTS_TAB_NAME} tabIndex={4} />
                    <div className={classes.central2}>
                        <Tooltip title={configDetails.Version ? "VERSIONS\nServer: " + configDetails.Version + ", UI: " + UI_VERSION : "VERSIONS\nServer: not found, UI:" + UI_VERSION} placement='bottom'>
                            <Info color='primary' />
                        </Tooltip>
                    </div>
                </Tabs>
            </AppBar> : null}
            </Grid>
        </Box>
    )
}
