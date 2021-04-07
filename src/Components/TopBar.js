import { AppBar, Tabs, Tab, Box, Grid, Button, Toolbar, Typography, } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import USER from '../Components/Utils/User'
import Logo from '../netmaker.png'
import Logo2 from '../NM.png'

const GROUP_DETAIL_TAB_NAME = 'network details'
const NODE_DETAIL_TAB_NAME = 'nodes'
const OTK_DETAIL_TAB_NAME = 'access keys'

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

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
        paddingLeft: '0em'
    }, 
    title2: {
        textAlign: 'center',
        flexGrow: 1,
    }, 
    subTitle: {
        marginRight: '2em',
        cursor: 'pointer'
    },
    logo: {
        width: '60%',
        height: '2em',
        minWidth: '2em',
    },
    logo2: {
        width: '60%',
        height: '2em',
        minWidth: '2em',
    }
}))

export default function TopBar({setDataSelection, setCreatingGroup, currentUser, setUser, setIsLoggingIn, setIsUpdatingUser}) {

    const classes = useStyles()

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
      setDataSelection(newValue);
    };

    return (
        <Box display='flex' alignItems='center' justifyContent='center'>
            <Grid container className={classes.topBarMain}>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" onClick={() => setCreatingGroup(true)}>Create Network</Button>
                    <Typography variant="h3" className={classes.title} onClick={() => window.location.reload()}>
                        <img className={classes.logo} src={getWindowDimensions().width < 800 ? Logo2 : Logo} alt='Netmaker makes networks.' />
                    </Typography>
                    {currentUser ? 
                        <>
                            <Typography variant="p" className={classes.subTitle} onClick={() => setIsUpdatingUser(true)}>
                                <strong>{currentUser.username}</strong>
                            </Typography>
                            <Button color="inherit" onClick={() => USER.logout(setUser, setIsLoggingIn)}>Logout</Button>
                    </> : <Button color="inherit" onClick={() => setIsLoggingIn(true)}>Login</Button>
                    }
                </Toolbar>
            </AppBar>
                <AppBar position='relative' color='default'>
                    <Tabs 
                        value={value}
                        centered
                        aria-label="main table"
                        textColor='primary'
                        indicatorColor='primary'
                        onChange={handleChange}
                    >
                        <Tab label={GROUP_DETAIL_TAB_NAME} tabIndex={0} />
                        <Tab label={NODE_DETAIL_TAB_NAME} tabIndex={1} />
                        <Tab label={OTK_DETAIL_TAB_NAME} tabIndex={2} />
                    </Tabs>
                </AppBar>
            </Grid>
        </Box>
    )
}
