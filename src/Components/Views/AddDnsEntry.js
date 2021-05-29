import { TextField, Button, Grid, Typography, CircularProgress, Menu, MenuItem , Tooltip, IconButton} from '@material-ui/core'
import Info from '@material-ui/icons/Info'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DNS_API from '../Utils/DNS'

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

export default function AddDnsEntry({ setOpen, networkName, nodes, netid, setShouldUpdate, user }) {

    const [dnsName, setDnsName] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [error, setError] = React.useState('')
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [openMenu, setOpenMenu] = React.useState(false)
    const [success, setSuccess] = React.useState('')

    const classes = useStyles()
    const correctSubnetRegex =  new RegExp(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i) // new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/i)
    const correctInterfaceNameRegex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,128}$/i)

    const validate = () => {
        const isSubnet = correctSubnetRegex.test(address) 
        const isInterface = correctInterfaceNameRegex.test(dnsName)
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
            setIsProcessing(true)
            const response = await DNS_API.createEntry(networkName, dnsName, address, user.token)
            if (response) {
                setSuccess(`Successfully added DNS entry with name ${dnsName} for address: ${address}`)
                setDnsName('')
                setAddress('')
                setShouldUpdate(true)
                setTimeout(() => { setOpen(false); setSuccess('')}, 1500)
            } else {
                setError('Could not complete request, please check connections and try again.')
            }
            setIsProcessing(false)
        } else {
            if (cause === 'subnet')
                setError('Invalid address range provided. Please check formatting. ex: "192.168.1.69"')
            else 
                setError('Invalid DNS entry name provided. Max 128 alphanumeric characters with hyphens [-] and an extension [.com, .net, ...].')
        }
        setTimeout(() => setError(''), 1500)
    }

    const handleUpdateAddress = (event) => {
        event.preventDefault()
        setAddress(event.target.value)
    }

    const handleUpdateDnsName = (event) => {
        event.preventDefault()
        setDnsName(event.target.value)
    }

    const handleNodeSelect = (event, node) => {
        event.preventDefault()
        setAddress(node.address)
        handleMenuClose()
    }

    return (
        <Grid container xs={12} justify='center' className={classes.mainContainer}>
            <Grid item xs={8} >
                <div className={classes.center} >
                    <h4>Make a new DNS entry in network {networkName}.</h4>
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
                        Choose Node
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
                    {nodes.map(node => node.network === netid ?
                        <MenuItem onClick={(event) => handleNodeSelect(event, node)} key={node.address}>
                            {node.name}{' '}|{' '}{node.address}
                        </MenuItem> : null)
                    }
                </Menu>
            </Grid>
            <Grid item xs={8}>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <Grid container className={classes.container}>
                        <Grid item xs={1}>
                            <Tooltip title='This is the IP Address of the machine in the network.' placement='top'>
                                <IconButton aria-label={`Set IP address for dns entry.`}>
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
                                name="address"
                                label="Address"
                                placeholder='192.168.1.1'
                                type="text"
                                onChange={handleUpdateAddress}
                                id="addressrange"
                                value={address}
                                autoFocus
                                autoComplete="false"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Tooltip title="The dns entry you would like for the machine, typically something.com or whatever.net, etc." placement='top'>
                                <IconButton aria-label={`The DNS entry name.`}>
                                    <Info />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs ={7}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="networkName"
                                label="DNS Entry Name"
                                name="networkName"
                                placeholder='my-dns-entry.com'
                                autoComplete="false"
                                value={dnsName}
                                onChange={handleUpdateDnsName}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant='body1'>
                                .{networkName}
                            </Typography>
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
                                Add DNS Entry
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}
