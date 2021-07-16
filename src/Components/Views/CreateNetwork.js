import { TextField, Button, Grid, Typography, CircularProgress, FormControlLabel, Checkbox } from '@material-ui/core'
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
    }
}

const useStyles = makeStyles(styles)

export default function CreateNetwork({ setIsCreating, setSuccess, setShouldUpdate, user }) {

    const [networkName, setNetworkName] = React.useState('')
    const [addressrange, setAddressrange] = React.useState('')
    const [localaddressrange, setLocalAddressrange] = React.useState('')
    const [error, setError] = React.useState('')
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [isLocal, setIsLocal] = React.useState(false)
    const [isAddress6, setIsAddress6] = React.useState(false)

    const DEFAULT_ADDRESS_6 = 'fd39:75a7:808f:649d::/64'

    const classes = useStyles()
    const correctSubnetRegex = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d{1,3}$/i)
    const correctNetworkNameRegex = new RegExp(/^[a-z0-9,\-,_,a-z0-9]{1,12}[\.,a-z0-9]*$/i)

    const validate = () => {
        const isSubnet = correctSubnetRegex.test(addressrange) 
        const isNetworkName = correctNetworkNameRegex.test(networkName)
        const isLocalAddress = correctSubnetRegex.test(localaddressrange)
        if (!isSubnet) return {status: false, cause: 'subnet'}
        if (!isNetworkName) return {status: false, cause: 'networkName'}
        if (isLocal && !isLocalAddress) return {status: false, cause: 'local'}
        return {status: true}
    }

    const handleSubmit = async () => {
        const { status, cause } = validate()
        if (status) { // check if validated
            // send request
            setIsProcessing(true)
            try {
                const response = await API(user.token).post('/networks', {
                    addressrange,
                    netid: networkName,
                    localrange: localaddressrange,
                    islocal: isLocal,
                    isdualstack: isAddress6,
                    addressrange6: DEFAULT_ADDRESS_6
                })
                setNetworkName('')
                setAddressrange('')
                setLocalAddressrange('')
                if (response.status === 200) {
                    setSuccess(`Successfully created network ${networkName}`)
                    setIsCreating(false)
                    setShouldUpdate(true)
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                } else {
                    setError('Could not complete request, please try again later.')
                }
            } catch (err) {
                setError(`Could not create network, ${networkName}, invalid request.`)
                setTimeout(() => {
                    setError('')
                }, 1500)
            }
            setIsProcessing(false)
        } else {
            if (cause === 'subnet')
                setError('Invalid subnet provided. Please check formatting. ex: 192.168.1.10/23.')
            else if (cause === 'local')
                setError('Invalid local address provided. Please check formatting. ex: 192.168.1.10/23.')
            else 
                setError('Invalid network name provided. Max 12 alphanumeric characters with underscores or hyphens.')
        }
    }

    const handleUpdateAddress = (event) => {
        event.preventDefault()
        setAddressrange(event.target.value)
    }

    const handleUpdateLocalAddress = (event) => {
        event.preventDefault()
        setLocalAddressrange(event.target.value)
    }

    const handleUpdateNetworkName = (event) => {
        event.preventDefault()
        setNetworkName(event.target.value)
    }

    const toggleIsLocal = (event) => {
        event.preventDefault()
        setIsLocal(event.target.checked)
        if (!event.target.checked) setLocalAddressrange('')
    }

    const toggleIsAddress6 = (event) => {
        event.preventDefault()
        setIsAddress6(event.target.checked)
    }

    return (
        <Grid container xs={12} justify='center' className={classes.mainContainer}>
            <Grid item xs={8} >
                <div className={classes.center} >
                    {error && 
                        <Typography variant="h5" color='error'>
                            {error}
                        </Typography>
                    }
                    {
                        isProcessing && <CircularProgress />
                    }
                </div>
                <Button color="primary" onClick={() => setIsCreating(false)} disabled={isProcessing} >
                    Back
                </Button>
            </Grid>
            <Grid item xs={8}>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="networkName"
                        label="Network Name"
                        name="networkName"
                        placeholder='my-net'
                        autoComplete="false"
                        autoFocus
                        value={networkName}
                        onChange={handleUpdateNetworkName}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="addressrange"
                        label="Address Range"
                        placeholder='0.0.0.0/32'
                        type="text"
                        onChange={handleUpdateAddress}
                        id="addressrange"
                        value={addressrange}
                        autoComplete="false"
                    />
                    <Grid container justifyContent='center' alignItems='center'>
                        <Grid item xs={isAddress6 ? 4 : 12}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={isAddress6}
                                    onChange={toggleIsAddress6}
                                    name="isAddress6"
                                    color="primary"
                                />
                                }
                                label="Use Dual Stack (IPv6)?"
                            />
                        </Grid>
                        {isAddress6 ? <Grid item xs={8}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="address6"
                                label="Default IPv6 Address"
                                placeholder={DEFAULT_ADDRESS_6}
                                type="text"
                                disabled
                                id="address6"
                                value={DEFAULT_ADDRESS_6}
                                autoComplete="false"
                            /></Grid> : null}
                    </Grid>
                    <Grid container justifyContent='center' alignItems='center'>
                        <Grid item xs={isLocal ? 4 : 12}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={isLocal}
                                    onChange={toggleIsLocal}
                                    name="isLocal"
                                    color="primary"
                                />
                                }
                                label="Is Local?"
                            />
                        </Grid>
                        {isLocal ? <Grid item xs={8}> <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="localaddressrange"
                            label="Local Address Range"
                            placeholder='0.0.0.0/32'
                            type="text"
                            onChange={handleUpdateLocalAddress}
                            id="localaddressrange"
                            value={localaddressrange}
                            autoComplete="false"
                        /></Grid> : null}
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isProcessing}
                    >
                        Create Network
                    </Button>
                </form>
            </Grid>
        </Grid>
    )
}
