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
    },
    center: {
        textAlign: 'center'
    }
}

const useStyles = makeStyles(styles)

export default function CreateKey({ setIsCreating, setSuccess, handleSubmit }) {

    const [keyName, setKeyName] = React.useState('')
    const [keyUses, setKeyUses] = React.useState(0)

    const classes = useStyles()

    const handleUpdateKeyUses = (event) => {
        event.preventDefault()
        let value = event.target.value 
        if (parseInt(value) < 0) value = 0
        setKeyUses(value)
    }

    const handleUpdateKeyName = (event) => {
        event.preventDefault()
        setKeyName(event.target.value)
    }

    return (
        <Grid container xs={12} justify='center' className={classes.mainContainer}>
            <Grid item xs={8} >
                <Button color="primary" onClick={() => setIsCreating(false)} >
                    Back
                </Button>
            </Grid>
            <Grid item xs={8}>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); handleSubmit(e, keyName, parseInt(keyUses)); }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="keyName"
                        label="Key Name"
                        name="keyName"
                        placeholder='my-key'
                        autoComplete="false"
                        autoFocus
                        value={keyName}
                        onChange={handleUpdateKeyName}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type='number'
                        name="Key Uses"
                        label="Number of Key Uses"
                        placeholder='0'
                        onChange={handleUpdateKeyUses}
                        id="keyuses"
                        value={keyUses}
                        autoComplete="false"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Create Key
                    </Button>
                </form>
            </Grid>
        </Grid>
    )
}
