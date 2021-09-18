import { TextField, Button, Grid, Typography, CircularProgress } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Checkbox from '@material-ui/core/Checkbox'
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

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

const useStyles = makeStyles(theme => ({...styles,
    formControl: {
        margin: theme.spacing(1),
        minWidth: '120px',
        maxWidth: '300px',
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}))

export default function RelayDetails({ handleClose, setSuccess, addRelay, relayNode, nodeData }) {

    const [relayedNodes, setRelayedNodes] = React.useState('')
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [error, setError] = React.useState('')
    const [selectedNodes, setSelectedNodes] = React.useState([])

    const classes = useStyles()

    const handleChange = (event) => {
        event.preventDefault()
        setSelectedNodes(event.target.value)
        setRelayedNodes(event.target.value.join(','))
    }

    return (
        <Grid container xs={12} justify='center' className={classes.mainContainer}>
            <Grid item xs={10} >
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
                <Button color="primary" onClick={handleClose} disabled={isProcessing}>
                    Back
                </Button>
            </Grid>
            <Grid item xs={12}>
                <h3 style={{textAlign: 'center'}}>Relaying on Node, {relayNode.name}</h3>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); addRelay(relayNode, selectedNodes); }}>
                    <Grid container justifyContent='space-between' alignItems='center'>
                        <Grid item xs={10} md={5}>
                            <FormControl className={classes.formControl} fullWidth>
                                <InputLabel id="nodes-checkbox-label">Select Node Addresses</InputLabel>
                                <Select
                                    labelId="nodes-checkbox-label"
                                    id="demo-mutiple-checkbox"
                                    multiple
                                    required
                                    value={selectedNodes}
                                    onChange={handleChange}
                                    input={<Input autoFocus/>}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                    >
                                    {nodeData && nodeData.length ? nodeData.map(node => (
                                        <MenuItem key={node.name} value={node.address}>
                                            <Checkbox color="primary" checked={selectedNodes.indexOf(node.address) >= 0} />
                                            <ListItemText primary={node.name} />
                                        </MenuItem>
                                    )) : null}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={10} md={5}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="relayedNodes"
                                label="Relayed Node Addresses"
                                name="relayedNodes"
                                placeholder='Select nodes from the drop down'
                                autoComplete="false"
                                value={relayedNodes}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isProcessing}
                        style={{marginTop: '1em'}}
                    >
                        Create Relay Node
                    </Button>
                </form>
            </Grid>
        </Grid>
    )
}
