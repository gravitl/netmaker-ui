import { TextField, Button, Grid, Typography, CircularProgress } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import USER from '../Utils/User'

const styles = {
    vertTabs: {
        position: 'relative',
    },
    mainContainer: {
        marginTop: '2em'
    },
    center: {
        textAlign: 'center'
    }
}

const useStyles = makeStyles(styles)

export default function UpdateUser({ setIsUpdating, setSuccess, setShouldUpdate, currentUser }) {

    const [userName, setUserName] = React.useState('')
    const [error, setError] = React.useState('')
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')

    const classes = useStyles()
    const correctUserNameRegex = new RegExp(/^[a-zA-Z0-9,\-,a-zA-Z0-9]{4,16}$/i)
    const correctPasswordRegex = new RegExp(/^[a-zA-Z0-9,\-,_,!,#,a-zA-Z0-9]{5,64}$/i)

    const validate = () => {
        const isUserName = correctUserNameRegex.test(userName)
        const isPassword = correctPasswordRegex.test(password)
        const isConfirmPassword = correctPasswordRegex.test(confirmPassword) && password === confirmPassword
        if (!isUserName) return {status: false, cause: 'user'}
        if (!isPassword) return {status: false, cause: 'password'}
        if (!isConfirmPassword) return {status: false, cause: 'confirm'}
        return {status: true}
    }

    const handleSubmit = async () => {
        const { status, cause } = validate()
        if (status) { // check if validated
            // send request
            setIsProcessing(true)
            const response = await USER.update(userName, password)
            setIsProcessing(false)
            setUserName('')
            setPassword('')
            setConfirmPassword('')
            if (response) {
                setSuccess(`Successfully updated user ${userName}.`)
                setIsUpdating(false)
                setShouldUpdate(true)
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            } else {
                setError('Could not complete request, please try again later.')
            }
        } else {
            if (cause === 'user')
                setError('Invalid user name provided. Must be between 4 to 16 alphanumeric characters with hyphens.')
            else if (cause === 'password')
                setError('Invalid password provided. Must be between 5 to 64 alphanumeric characters or special characters: "!-_#".')
            else 
                setError('Passwords do not match.')
        }
    }

    const handleUpdatePassword = (event) => {
        event.preventDefault()
        setPassword(event.target.value)
    }

    const handleUpdateConfirmPassword = (event) => {
        event.preventDefault()
        setConfirmPassword(event.target.value)
    }

    const handleUpdateUserName = (event) => {
        event.preventDefault()
        setUserName(event.target.value)
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
                <Button color="primary" onClick={() => setIsUpdating(false)} disabled={isProcessing}>
                    Back
                </Button>
            </Grid>
            <Grid item xs={8}>
                <h3 style={{textAlign: 'center'}}>Updating User: {currentUser.username}.</h3>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="User Name"
                        name="userName"
                        placeholder='my-new-user'
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isProcessing}
                        style={{marginTop: '1em'}}
                    >
                        Update User
                    </Button>
                </form>
            </Grid>
        </Grid>
    )
}
