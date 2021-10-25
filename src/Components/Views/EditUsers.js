import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


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
    buttonMarg: {
        marginTop: '3em'
    }
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
}));

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

export default function EditUsers({networks, users, submitNetworkChanges, isProcessing}) { 

    const classes = useStyles()
    const [selectedNetworks, setSelectedNetworks] = React.useState([])
    const [userName, setUserName] = React.useState('')
    const [makingAdmin, setMakingAdmin] = React.useState(false)

    const toggleMakingAdmin = (event) => {
        console.log(event.target.checked)
        if (event.target.checked) {
            setSelectedNetworks([])
        }
        setMakingAdmin(!makingAdmin)
    }

    const handleNetChange = (event) => {
        setSelectedNetworks(event.target.value);
    };

    return (
        <Grid container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
                <div className={classes.center}>
                    <h2>Edit a user's network access</h2>
                    <hr/>
                </div>
            </Grid>
            {(users && networks && users.length) ? <>
            <Grid item xs={5}>
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
                </div>
            </Grid>
            <Grid item xs={5}>
                <FormControl className={classes.formControl} fullWidth disabled={makingAdmin}>
                    <InputLabel id="networks-checkbox-label">Select Accessible Networks</InputLabel>
                    <Select
                    labelId="networks-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={selectedNetworks}
                    onChange={handleNetChange}
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
                </FormControl>
            </Grid>
            <Grid item xs={1}>
            <FormControlLabel
                control={
                <Checkbox
                    checked={makingAdmin}
                    onChange={toggleMakingAdmin}
                    name="isAddress6"
                    color="primary"
                />
                }
                label="Make Admin"
            />
            </Grid>
            <Grid item xs={6}>
                <div className={classes.buttonMarg}>
                    <Button
                        onClick={() => { 
                            if (makingAdmin && window.confirm(`Are you sure you want to convert ${userName} into an Admin?`)) {
                                submitNetworkChanges(userName, selectedNetworks, makingAdmin) 
                            }
                            else {
                                submitNetworkChanges(userName, selectedNetworks, false)
                            }
                        }}
                        className={classes.buttonMarg}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!userName || isProcessing}
                    >
                    {userName ? `Submit Changes for ${userName}` : `Select a user to adjust networks for`}
                    </Button>
                </div>
            </Grid>
            </>
            : <Grid item xs={8}><h2>No users available to edit (can not edit other admins)</h2></Grid>
            }
        </Grid>
    )
}
