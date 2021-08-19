import React from 'react'
import randomColor from 'randomcolor'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NetworkDetails from './NetworkDetails'
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
        maxHeight: '38em',
        overflowY: 'scroll',
        overflow: 'hidden',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
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

const displayedNetworkFields = [
    'addressrange',
    'nodeslastmodified',
    'networklastmodified',
]

export default function AllNetworks({ networks, setSuccess, setNetworkData, user, clientMode, config }) {

    const classes = useStyles()
    const [selectedNetwork, setSelectedNetwork] = React.useState(null)
    const [error, setError] = React.useState('')
    const [refreshSuccess, setRefreshSuccess] = React.useState('')

    const handleNetworkSelect = network => {
        setSelectedNetwork(networks.indexOf(network))
    }

    const handlePublicKeyRefresh = async (networkName, displayName) => {
        try {
            if (window.confirm(`Are you sure you want to refresh the node public keys on network: ${displayName}?`)) {
                const response = await API(user.token).post(`/networks/${networkName}/keyupdate`)
                if (response.status === 200) {
                    setSuccess(`Refreshed Keys for ${networkName}.`)
                } else {
                    setError('Could not refresh keys for ', networkName, '.')
                }
            }
        } catch (err) {
            setError('Server error when refreshing keys for ', networkName, '.')
        }
        setTimeout(() => {
            setError('')
            setSuccess('')
        }, 1700)
    }

    return (
        networks[selectedNetwork] ? <NetworkDetails config={config} user={user} setNetworkData={setNetworkData} networkData={networks[selectedNetwork]} setSelectedNetwork={setSelectedNetwork} back setSuccess={setSuccess} /> :
        <Grid container justify='center' alignItems='center' className={classes.container}>
            <Grid item xs={11}>
            {refreshSuccess ? <div className={classes.center}><Typography variant='h6' color='primary'>{refreshSuccess}</Typography></div> : null}
            {error ? <div className={classes.center}><Typography variant='h6' color='error'>{error}</Typography></div> : null}
            <div className={classes.nodeTitle2}><Typography variant='h5'>All networks</Typography></div>
                {networks && networks.length ? networks.map((network, i) => 
                    <Card key={i} className={classes.row}>
                        <CardHeader 
                            title={network.displayname ? network.displayname : 'Not found'}
                            subheader={network.netid}
                            avatar={
                                <Avatar aria-label={network.displayname} style={{ backgroundColor: randomColor() }}>
                                  {network.displayname ? network.displayname.toUpperCase().substring(0,1) : 'N'}
                                </Avatar>
                            }
                            action={
                                <Tooltip title={`EDIT ${network.displayname}`} placement='top'>
                                    <IconButton aria-label={`edit network ${network.displayname}`} onClick={() => handleNetworkSelect(network)}>
                                    <Edit />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                        <CardContent>
                        <Grid container>
                            <Grid item className={classes.buttonContainer} xs={4} md={2} >
                                <Tooltip title={`Refresh Public Keys for ${network.displayname}`} placement='top'>
                                    <IconButton aria-label={`refresh public keys ${network.displayname}`} onClick={() => handlePublicKeyRefresh(network.netid, network.displayname)}>
                                        <Sync />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        {displayedNetworkFields.map((fieldName, j) => (
                            <Grid item className={classes.cell} key={j} xs={fieldName === 'addressrange' ? 8 : 12} md={3}>
                                <TextField
                                        id="filled-full-width"
                                        label={fieldName.toUpperCase()}
                                        placeholder={fieldName === 'addressrange' ? network[fieldName].toString() : Util.timeConverter(network[fieldName].toString())}
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
