import React from 'react'
import randomColor from 'randomcolor'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import GroupDetails from './GroupDetails'
import Edit from '@material-ui/icons/Edit'
import Sync from '@material-ui/icons/Sync'
import IconButton from '@material-ui/core/IconButton'
import '../../App.css'
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Util from '../Utils/Fields'
import API from '../Utils/API'

const useStyles = makeStyles((theme) => ({
    container: {
        maxHeight: '28em',
        overflowY: 'scroll',
        overflow: 'hidden',
        borderRadius: '8px'
    },
    row: {
        marginBottom: '0.5em',
        marginTop: '1em',
    },
    cell: {
        padding: '0.5em',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        height: '60%'
    },
    nodeTitle: {
        textAlign: 'center'
    },
    nodeTitle2: {
        textAlign: 'center',
        marginTop: '1em',
        marginBottom: '1em'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    center: {
        textAlign: 'center'
    },
}));

const displayedGroupFields = [
    'addressrange',
    'nodeslastmodified',
    'grouplastmodified',
]

export default function AllGroups({ groups, setSuccess, setGroupData}) {

    const classes = useStyles()
    const [selectedGroup, setSelectedGroup] = React.useState(null)
    const [error, setError] = React.useState('')
    const [refreshSuccess, setRefreshSuccess] = React.useState('')

    const handleGroupSelect = (group) => {
        setSelectedGroup(groups.indexOf(group))
    }

    const handlePublicKeyRefresh = async (groupName, displayName) => {
        try {
            if (window.confirm(`Are you sure you want to refresh the node public keys on network: ${displayName}?`)) {
                const response = await API.post(`/groups/${groupName}/keyupdate`)
                if (response.status === 200) {
                    setSuccess(`Refreshed Keys for ${groupName}.`)
                } else {
                    setError('Could not refresh keys for ', groupName, '.')
                }
            }
        } catch (err) {
            setError('Server error when refreshing keys for ', groupName, '.')
        }
        setTimeout(() => {
            setError('')
            setSuccess('')
        }, 1700)
    }

    return (
        groups[selectedGroup] ? <GroupDetails setGroupData={setGroupData} groupData={groups[selectedGroup]} setSelectedGroup={setSelectedGroup} back setSuccess={setSuccess} /> :
        <Grid container justify='center' alignItems='center' className={classes.container}>
            <Grid item xs={11}>
            {refreshSuccess ? <div className={classes.center}><Typography variant='h6' color='primary'>{refreshSuccess}</Typography></div> : null}
            {error ? <div className={classes.center}><Typography variant='h6' color='error'>{error}</Typography></div> : null}
            <div className={classes.nodeTitle2}><Typography variant='h5'>All networks</Typography></div>
            {groups && groups.length ? groups.map(group => 
                    <Card className={classes.row}>
                        <CardHeader 
                            title={group.displayname}
                            subheader={group.nameid}
                            avatar={
                                <Avatar aria-label={group.displayname} style={{ backgroundColor: randomColor() }}>
                                  {group.displayname.toUpperCase().substring(0,1)}
                                </Avatar>
                            }
                            action={
                                <Tooltip title={`EDIT ${group.displayname}`} placement='top'>
                                    <IconButton aria-label={`edit group ${group.displayname}`} onClick={() => handleGroupSelect(group)}>
                                    <Edit />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                        <CardContent>
                        <Grid container key={group.address} >
                            <Grid item className={classes.buttonContainer} xs={2} >
                                <Tooltip title={`Refresh Public Keys for ${group.displayname}`} placement='top'>
                                    <IconButton aria-label={`edit group ${group.displayname}`} onClick={() => handlePublicKeyRefresh(group.nameid, group.displayname)}>
                                        <Sync />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        {displayedGroupFields.map(fieldName => (
                            <Grid item className={classes.cell} key={group.address} xs={fieldName === 'addressrange' ? 10 : 12} md={3}>
                                <TextField
                                        id="filled-full-width"
                                        label={fieldName.toUpperCase()}
                                        placeholder={fieldName === 'addressrange' ? group[fieldName].toString() : Util.timeConverter(group[fieldName].toString())}
                                        key={fieldName}
                                        fullWidth
                                        disabled
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                    />
                            </Grid>
                        ))}
                        </Grid>
                        </CardContent>
                    </Card>
            ) : <div className={classes.nodeTitle}><h3>There are no networks...</h3></div>}     
            </Grid>       
        </Grid>
    )
}
