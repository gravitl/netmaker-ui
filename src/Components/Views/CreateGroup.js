import { TextField, Button, Grid, Typography, CircularProgress } from '@material-ui/core'
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

export default function CreateGroup({ setIsCreating, setSuccess, setShouldUpdate }) {

    const [groupName, setGroupName] = React.useState('')
    const [addressrange, setAddressrange] = React.useState('')
    const [error, setError] = React.useState('')
    const [isProcessing, setIsProcessing] = React.useState(false)

    const classes = useStyles()
    const correctSubnetRegex = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d{1,3}$/i)
    const correctGroupNameRegex = new RegExp(/^[a-zA-Z0-9,\-,_,a-zA-Z0-9]{3,12}$/i)

    const validate = () => {
        const isSubnet = correctSubnetRegex.test(addressrange) 
        const isGroupName = correctGroupNameRegex.test(groupName)
        if (!isSubnet) return {status: false, cause: 'subnet'}
        if (!isGroupName) return {status: false, cause: 'groupName'}
        return {status: true}
    }

    const handleSubmit = async () => {
        const { status, cause } = validate()
        if (status) { // check if validated
            // send request
            setIsProcessing(true)
            const response = await API.post('/groups', {
                addressrange,
                nameid: groupName
            })

            setIsProcessing(false)
            setGroupName('')
            setAddressrange('')
            if (response.status === 200) {
                setSuccess(`Successfully created network ${groupName}`)
                setIsCreating(false)
                setShouldUpdate(true)
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            } else {
                setError('Could not complete request, please try again later.')
            }
        } else {
            if (cause === 'subnet')
                setError('Invalid subnet provided. Please check formatting. ex: 192.168.1.10/23.')
            else 
                setError('Invalid group name provided. Max 12 alphanumeric characters with underscores or hyphens.')
        }
    }

    const handleUpdateAddress = (event) => {
        event.preventDefault()
        setAddressrange(event.target.value)
    }

    const handleUpdateGroupName = (event) => {
        event.preventDefault()
        setGroupName(event.target.value)
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
                        id="groupName"
                        label="Network Name"
                        name="groupName"
                        placeholder='my-net'
                        autoComplete="false"
                        autoFocus
                        value={groupName}
                        onChange={handleUpdateGroupName}
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
