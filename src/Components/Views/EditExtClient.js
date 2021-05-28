import { TextField, Button, Grid, } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const styles = {
    vertTabs: {
        position: 'relative',
    },
    mainContainer: {
        marginTop: '2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2em'
    },
    center: {
        textAlign: 'center'
    }
}

const useStyles = makeStyles(styles)

export default function EditExtClient({ handleSubmit, client }) {

    const [clientId, setClientId] = React.useState('')

    const classes = useStyles()

    const handleUpdateClientId = (event) => {
        event.preventDefault()
        setClientId(event.target.value)
    }

    return (
        <Grid container justify='center' className={classes.mainContainer}>
            <Grid item xs={10}>
                <div className={classes.center}><h3>Editing client: {client.clientid}</h3></div>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); handleSubmit(client, clientId); }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="clientid"
                        label="New Client ID"
                        name="clientid"
                        placeholder='My-Laptop'
                        autoComplete="false"
                        autoFocus
                        value={clientId}
                        onChange={handleUpdateClientId}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Submit
                    </Button>
                </form>
            </Grid>
        </Grid>
    )
}
