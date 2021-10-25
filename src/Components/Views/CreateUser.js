import { TextField, Button, Grid, Typography, CircularProgress, FormControlLabel, IconButton, Tooltip } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import USER from '../Utils/User'
import User from '../Utils/User'
import Common from '../../Common'
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import Modal from '@material-ui/core/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import VpnKey from '@material-ui/icons/VpnKey';
import EditUsers from './EditUsers'

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
    currentUserBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}

const useStyles = makeStyles(theme => ({...styles,
    formControl: {
        margin: theme.spacing(1),
        minWidth: '120px',
        maxWidth: '300px',
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    paperModal: {
        position: 'absolute',
        width: '60%',
        backgroundColor: theme.palette.background.paper,
        outline: 0, // Disable browser on-focus borders
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

export default function CreateUser({ setIsCreating, setSuccess, setShouldUpdate, isAdmin, hasBack, networks }) {

    const [userName, setUserName] = React.useState('')
    const [error, setError] = React.useState('')
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [currentUser, setCurrentUser] = React.useState(null)
    const [isCreatingAdmin, setIsCreatingAdmin] = React.useState(false)
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [selectedNetworks, setSelectedNetworks] = React.useState([])
    const [deleteMode, setDeleteMode] = React.useState(false)
    const [editingMode, setEditingMode] = React.useState(false)
    const [users, setUsers] = React.useState([])

    const classes = useStyles()
    const correctUserNameRegex = new RegExp(/^(([a-zA-Z0-9,\-,\.]*)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})){3,40}$/i)
    const correctPasswordRegex = new RegExp(/^.{5,64}$/i)

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleChange = (event) => {
        setSelectedNetworks(event.target.value);
    };

    React.useEffect(() => {
        if (!currentUser) {
            User.getUser(user => { 
                if (user) {
                    setCurrentUser(user);
                    User.getAllUsers(user.token, users => setUsers(users));
                }
            }, 
            noop => {})
        }
    }, [currentUser])

    const validate = () => {
        const isUserName = correctUserNameRegex.test(userName)
        if (!deleteMode) {
            const isPassword = correctPasswordRegex.test(password)
            const isConfirmPassword = correctPasswordRegex.test(confirmPassword) && password === confirmPassword
            if (!isPassword) return {status: false, cause: 'password'}
            if (!isConfirmPassword) return {status: false, cause: 'confirm'}
        }
        if (!isUserName) return {status: false, cause: 'user'}
        return {status: true}
    }

    const handleUserNetworkUpdate = async (username, nets, makeAdmin) => {
        if (currentUser && currentUser.token && username) {
            setIsProcessing(true)
            const response = await USER.updateUserNetworks(currentUser.token, username, nets, makeAdmin)
            if (response) {
                setSuccess(`successfully updated networks for user, ${username}`)
                setError('')
                setTimeout(() => setSuccess(''), 1200)
            } else {
                setError(`failed to push edits for user, ${username}`)
            }
            setIsProcessing(false)
        } else {
            setError('no user found to complete request')
        }
    }

    const handleSubmit = async () => {
        const { status, cause } = validate()
        if (status) { // check if validated
            // send request
            setIsProcessing(true)
            let response = null
            if (deleteMode) {
                if (window.confirm(`Are you sure you want to remove user ${userName}?`)) {
                    response = await USER.deleteUser(currentUser.token, userName)
                }
            } else {
                if (isAdmin || isCreatingAdmin) {
                    response = await USER.createUserAdmin(currentUser.token, userName, password)
                } else {
                    if (selectedNetworks.length > 0) response = await USER.createRegularUser(currentUser.token, userName, password, selectedNetworks)
                    else {  
                        setIsProcessing(false)
                        return setError('Please select at least 1 network for the user.')
                    }
                }
            }
            if (!response) {
                setIsProcessing(false)
                return setError(`Could not complete request.${deleteMode ? ' User may not exist.' : ''}`)
            }
            setIsProcessing(false)
            setUserName('')
            setPassword('')
            setConfirmPassword('')
            if (response.status === 200) {
                setSuccess(`Successfully ${deleteMode ? 'deleted' : 'created'} user ${userName}.`)
                setIsCreating(false)
                setShouldUpdate(true)
                setTimeout(() => {
                    window.location.reload()
                }, 1200)
            } else {
                setError('Could not complete request, please try again later.')
            }
        } else {
            if (cause === 'user')
                setError('Invalid user name provided. Must be between 3 to 40 alphanumeric characters with "-" or "." or an email address.')
            else if (cause === 'password')
                setError('Invalid password provided. Must be between 5 to 64 characters with no white space.')
            else 
                setError('Passwords do not match.')
        }
    }

    const handleUpdatePassword = (event) => {
        event.preventDefault()
        setPassword(event.target.value.trim())
    }

    const handleUpdateConfirmPassword = (event) => {
        event.preventDefault()
        setConfirmPassword(event.target.value.trim())
    }

    const handleUpdateUserName = (event) => {
        event.preventDefault()
        setUserName(event.target.value.trim())
    }

    const handleClose = () => {
        setEditingMode(false)
    }

    return ((currentUser || isAdmin) ?
        <Grid container justify='center' className={classes.mainContainer}>

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
                {hasBack || currentUser ? 
                <Button color="primary" onClick={() => setIsCreating(false)} disabled={isProcessing || isAdmin}>
                    Back
                </Button> : null}
            </Grid>
            {editingMode ? <Grid item xs={10}>
                <Modal
                    aria-labelledby="gravitl"
                    aria-describedby="Copy your Netmaker Access Token Value"
                    className={classes.modal}
                    open={editingMode}
                    onClose={handleClose}
                    disablePortal
                    disableEnforceFocus
                    disableAutoFocus
                >
                    <div className={classes.paperModal}>
                        <EditUsers submitNetworkChanges={handleUserNetworkUpdate} networks={networks} users={users.filter(user => !user.isadmin)} />
                    </div>
                </Modal>
            </Grid> :
            <Grid item xs={8}>
                {
                    currentUser && currentUser.isadmin && !isAdmin ?<div className={classes.currentUserBox}>
                    <FormControlLabel
                        control={<Switch checked={deleteMode} color="primary" onChange={() => {setUserName('');setPassword('');setDeleteMode(!deleteMode);}} name="checkedA" />}
                        label="Delete a User?"
                        fullWidth
                    />
                    <FormControlLabel
                        control={<Switch checked={editingMode} color="primary" onChange={() => {setEditingMode(true)}} name="checkedB" />}
                        label="Edit users?"
                        fullWidth
                    /></div>: null
                }
                <h3 style={{textAlign: 'center'}}>{!deleteMode ? `Create a new ${(isAdmin || isCreatingAdmin) ? 'admin' : 'user'}.` : `Delete a user`}</h3>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    {!deleteMode ?
                    <>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="User Name"
                        name="userName"
                        placeholder='my-user'
                        autoComplete="false"
                        autoFocus
                        value={userName}
                        onChange={handleUpdateUserName}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        placeholder=''
                        type="password"
                        onChange={handleUpdatePassword}
                        id="password"
                        value={password}
                        autoComplete="false"
                    />
                     <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmpassword"
                        label="Password Confirmation"
                        placeholder=''
                        type="password"
                        onChange={handleUpdateConfirmPassword}
                        id="confirmpassword"
                        value={confirmPassword}
                        autoComplete="false"
                    />
                    { currentUser && !isAdmin ? 
                        <div className={classes.currentUserBox}>
                            {currentUser.isadmin ? 
                            <FormControlLabel 
                                control={<Checkbox onChange={() => { if (!isCreatingAdmin && window.confirm('Are you sure? By doing this, you will give the user admin rights over your NetMaker server.')) setIsCreatingAdmin(true); else setIsCreatingAdmin(false);}} checked={isCreatingAdmin} name="createadmin" color="primary"/>}
                                label="Grant Admin Access"
                            /> : null }
                            {isCreatingAdmin ? null : 
                            <FormControl className={classes.formControl} fullWidth>
                            <InputLabel id="networks-checkbox-label">Select Accessible Networks</InputLabel>
                            <Select
                                labelId="networks-checkbox-label"
                                id="demo-mutiple-checkbox"
                                multiple
                                value={selectedNetworks}
                                onChange={handleChange}
                                input={<Input />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                                >
                                {networks ? networks.map((name) => (
                                    <MenuItem key={name} value={name}>
                                    <Checkbox color="primary" checked={selectedNetworks.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                    </MenuItem>
                                )) : null}
                                </Select>
                                </FormControl>}
                        </div>
                        : null
                    }</> :
                    <div className={classes.currentUserBox}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth>
                        <InputLabel htmlFor="outlined-age-native-simple">Select User</InputLabel>
                        <Select
                        native
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        label="Select User"
                        inputProps={{
                            name: 'user',
                            id: 'outlined-user-select',
                        }}
                        >
                        <option aria-label="None" value="" />
                        {users && users.length ? users.map(user => <option value={user.username}>{user.username}</option>) : null}
                        </Select>
                    </FormControl>
                    </div> }
                    <Grid container style={{display: 'flex', justifyContent: 'space-between', marginTop: '1em', marginBottom: '2em'}}>
                        <Grid item xs={6}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isProcessing}
                            >
                            {!deleteMode ? `CREATE USER` : `DELETE USER`}
                            </Button>
                        </Grid>
                        {isAdmin? 
                            <Grid item xs={2}>
                                <Tooltip aria-label='Use OAuth provider to login' title='Use OAuth Provider to sign in' placement='top'>
                                    <IconButton
                                        color="primary"
                                        variant="contained"
                                        disabled={isProcessing}
                                        href={`${Common.BACKEND_URL}/api/oauth/login`}
                                    >
                                        <VpnKey />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        : null}
                    </Grid>
                </form>
            </Grid>}
        </Grid> : null
    )
}
