import { TextField, Button, Grid, Typography, CircularProgress, Menu, MenuItem , Tooltip, IconButton} from '@material-ui/core'
import Info from '@material-ui/icons/Info'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import API from '../Utils/API'

const styles = {
    vertTabs: {
        position: 'relative',
    },
    mainContainer: {
        marginTop: '2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        textAlign: 'center'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}

const useStyles = makeStyles(styles)

export default function CreateGateway({ setOpen, gatewayNode, networks }) {

    const [defaultInterface, setInterface] = React.useState('')
    const [addressrange, setAddressrange] = React.useState('')
    const [error, setError] = React.useState('')
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [openMenu, setOpenMenu] = React.useState(false)
    const [success, setSuccess] = React.useState('')

    const classes = useStyles()
    const correctSubnetRegex = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d{1,3}$/i)
    const correctInterfaceNameRegex = new RegExp(/^[a-zA-Z0-9,\-,_,a-zA-Z0-9]{3,15}$/i)

    const validate = () => {
        const isSubnet = correctSubnetRegex.test(addressrange) 
        const isInterface = correctInterfaceNameRegex.test(defaultInterface)
        if (!isSubnet) return {status: false, cause: 'subnet'}
        if (!isInterface) return {status: false, cause: 'interface'}
        return {status: true}
    }

    const handleMenuOpen = () => {
        setOpenMenu(true)
    }

    const handleMenuClose = () => {
        setOpenMenu(false)
    }

    const handleSubmit = async () => {
        const { status, cause } = validate()
        if (status) { // check if validated
            // send request
            setIsProcessing(true)
            const response = await API.post(`/nodes/${gatewayNode.network}/${gatewayNode.macaddress}/creategateway`, {
                rangestring: addressrange,
                interface: defaultInterface
            })
            setIsProcessing(false)
            setInterface('')
            setAddressrange('')
            if (response.status === 200) {
                setSuccess(`Successfully created gateway with node ${gatewayNode.name} for address range: ${addressrange}`)
                setTimeout(() => {
                    setSuccess('')
                }, 2000)
            } else {
                setError('Could not complete request, please try again later.')
            }
        } else {
            if (cause === 'subnet')
                setError('Invalid address range provided. Please check formatting. ex: 192.168.1.1/24.')
            else 
                setError('Invalid network interface provided. Max 15 alphanumeric characters with underscores [_] or hyphens [-].')
        }
    }

    const handleUpdateAddress = (event) => {
        event.preventDefault()
        setAddressrange(event.target.value)
    }

    const handleUpdateNetworkName = (event) => {
        event.preventDefault()
        setInterface(event.target.value)
    }

    const handleNetworkSelect = (event, network) => {
        event.preventDefault()
        setAddressrange(network.addressrange)
        setInterface(network.defaultinterface)
        handleMenuClose()
    }

    return (
        <Grid container xs={12} justify='center' className={classes.mainContainer}>
            <Grid item xs={8} >
                <div className={classes.center} >
                    <h4>Make {gatewayNode.name} into Gateway.</h4>
                    {error && 
                        <Typography variant="h5" color='error'>
                            {error}
                        </Typography>
                    }
                    {success && 
                        <Typography variant="h5" color='primary'>
                            {success}
                        </Typography>
                    }
                    {
                        isProcessing && <CircularProgress />
                    }
                </div>
                <div className={classes.buttons}>
                    <Button color="primary" onClick={() => setOpen(false)} >
                        Back
                    </Button>
                    <Button color="primary" variant="outlined" onClick={handleMenuOpen}>
                        Choose Network
                    </Button>
                </div>
                <Menu
                    id="simple-menu"
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    keepMounted
                    open={openMenu}
                    onClose={handleMenuClose}
                >
                    {networks.map(network => <MenuItem onClick={(event) => handleNetworkSelect(event, network)} key={network.netid}>
                        {network.displayname}
                    </MenuItem>)}
                    <MenuItem onClick={(event) => handleNetworkSelect(event, {addressrange: '0.0.0.0/0', defaultinterface: 'eth0'})}>
                        Internet (VPN)
                    </MenuItem>
                </Menu>
            </Grid>
            <Grid item xs={8}>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <Grid container className={classes.container}>
                        <Grid item xs={1}>
                            <Tooltip title='This is the IP Address  Range that this node will forward traffic to. for instance, your office LAN. This will typically be a 172.x.x.x or 192.x.x.x network, or one of your other Netmaker networks. We recommend using a Netmaker network,  but make sure this node is in it!' placement='top'>
                                <IconButton aria-label={`set address range for gateway node.`}>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs ={11}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="addressrange"
                                label="Address Range"
                                placeholder='192.168.1.1/24'
                                type="text"
                                onChange={handleUpdateAddress}
                                id="addressrange"
                                value={addressrange}
                                autoFocus
                                autoComplete="false"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Tooltip title='The network interface that this node uses (locally) to reach the address range provided above. For instance, "eth0". If using a This node will forward traffic to the address range specified using this interface.' placement='top'>
                                <IconButton aria-label={`set address range for gateway node.`}>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs ={11}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="networkName"
                                label="Network Interface"
                                name="networkName"
                                placeholder='eth0'
                                autoComplete="false"
                                value={defaultInterface}
                                onChange={handleUpdateNetworkName}
                            />
                        </Grid>
                        <Grid item xs ={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isProcessing}
                            >
                                Make Gateway
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}
