import { Box, Grid, Typography, CircularProgress, Card, CardHeader, CardContent, Modal, Button, IconButton, Tooltip } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit'
import Devices from '@material-ui/icons/Devices'
import Delete from '@material-ui/icons/Delete'
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreOutlined'
import SettingsInputAntenna from '@material-ui/icons/SettingsInputAntenna'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import API from '../Utils/API';
import FileDownload from 'js-file-download'
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import EditExtClient from './EditExtClient'

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: '60%',
        backgroundColor: theme.palette.background.paper,
        outline: 0, // Disable browser on-focus borders
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    centerVert: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        width: '90%',
        flexDirection: 'column'
    },
    cardMain: {
        width: '100%',
        marginTop: '1em',
    },
    container: {
        maxHeight: '32em',
        overflowY: 'scroll',
        overflow: 'hidden',
        marginTop: '-1em'
    },
    button: {
        marginLeft: '0.25em',
        marginRight: '0.25em',
        '&:hover': {
            backgroundColor: '#0000e4'
        }
    },
    button2: {
        marginLeft: '0.25em',
        marginRight: '0.25em',
        '&:hover': {
            backgroundColor: '#e40000'
        }
    },
    cardContainer: {
        overflowY: 'scroll',
        height: '24em',
        margin: '4px'
    },
    cardBasic: {
        marginBottom: '4px'
    },
    main: {
        marginTop: '2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backDrop: {
        background: 'rgba(255,0,0,1.0)',
    },
    qrImage: {
        '&:hover':{
            cursor: 'pointer'
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
  }));

export default function ExternalClients({ data, isAllNetworks, nodes }) {

    const classes = useStyles()

    const [ isProcessing, setIsProcessing ] = React.useState(false)
    const [ error, setError ] = React.useState('')
    const [ success, setSuccess ] = React.useState('')
    const [ hasChecked, setHasChecked ] = React.useState(false)
    const [ open, setOpen ] = React.useState(false)
    const [ externals, setExternals ] = React.useState([])
    const [ qrCodes, setQrCodes ] = React.useState([]) 
    const [ modalDisplay, setModalDisplay ] = React.useState(null)
    const [ currentClient, setCurrentClient ] = React.useState('')

    const handleClose = () => {
        setOpen(false)
        setModalDisplay(null)
    }

    const openModal = (isImg, imgSrc, client) => {
        setOpen(true)
        if (isImg) {
            setModalDisplay(<img style={{width: 'auto'}} src={imgSrc} alt={`QR code for ${client.clientid}`} />)
        } else {
            // TODO: Display editable client data...
            setModalDisplay(<EditExtClient client={client} handleSubmit={handleUpdateClient} handleClose={handleClose} />)
        }
    }

    const handleUpdateClient = async (client, clientid) => {
        setIsProcessing(true)
        setError('')
        try {
            const response = await API.put(`/extclients/${client.network}/${client.clientid}`, {clientid})
            if (response.status === 200) {
                fetchExternals()
                setSuccess(`Successfully updated client, ${client.clientid}, to ${clientid} on network, ${client.network}.`)
            } else {
                setError(`Failed to update client, ${client.clientid}!`)
            }
            setIsProcessing(false)
        } catch (err) {
            setError(`Server error occurred, could not update ${client.clientid}!`)
        }
        setIsProcessing(false)
        handleClose()
        setTimeout(() => {
            setError('')
            setSuccess('')
        }, 1500)
    }

    const fetchExternals = async () => {
        setHasChecked(true)
        setIsProcessing(true)
        setError('')
        try {
            const response = await API.get(`/extclients`)
            if (response.status === 200) {
                setExternals(response.data)
                getQrCodes(response.data)
            } else {
                setError('Unable to fetch Keys!')
            }
            setIsProcessing(false)
        } catch (err) {
            setError('Unable to fetch Keys!')
            setIsProcessing(false)
        }
    }

    const getQrCodes = clients => {
        try {
            let newQrSources = []
            clients.map(async client => {
                    const response = await API.get(`/extclients/${client.network}/${client.clientid}/qr`, { responseType: 'arraybuffer' })
                    if (response.status === 200) {
                        const base64 = btoa(
                            new Uint8Array(response.data).reduce(
                              (data, byte) => data + String.fromCharCode(byte),
                              '',
                            ),
                        );
                        newQrSources.push("data:;base64," + base64)
                    } else {
                        setQrCodes([])
                        setError('Failed to fetch QR codes!')
                        return
                    }
                }
            )
            setQrCodes(newQrSources)
        } catch (err) {
            setError('Server error occurred when fetching QR Codes!')
        }
    }

    const createNewClient = async (network, macaddress) => {
        if (window.confirm(`Are you sure you want to add an external client to network ${network}?`)) {
            setIsProcessing(true)
            setError('')
            try {
                const response = await API.post(`/extclients/${network}/${macaddress}`)
                if (response.status === 200) {
                    setSuccess(`Successfully created new client in network, ${network}.`)
                    fetchExternals()
                } else {
                    setError('Unable to create new key!')
                }
                setIsProcessing(false)
            } catch (err) {
                setError('Unable to create new key!')
                setIsProcessing(false)
            }
            setTimeout(() => {
                setError('')
                setSuccess('')
            }, 1500)
        }
    }

    const getConfigFile = async client => {
        setIsProcessing(true)
        try {
            const response = await API.get(`/extclients/${client.network}/${client.clientid}/file`, { responseType: 'blob' })
            if (response.status === 200) {
                FileDownload(response.data, `${client.clientid}.conf`)
            } else {
                setError(`Unable to fetch config file for client, ${client.clientid}!`)
                setTimeout(() => {
                    setError('')
                }, 1500)
            }
        } catch (err) {
            setError(`Server error occurred when fetching config file for client, ${client.clientid}!`)
            setTimeout(() => {
                setError('')
            }, 1500)
        }
        setIsProcessing(false)
    }

    const deleteClient = async client => {
        if (window.confirm(`Are you sure you want to remove client: ${client.clientid} from network ${client.network}?`)) {
            setIsProcessing(true)
            try {
                const response = await API.delete(`/extclients/${client.network}/${client.clientid}`)
                if (response.status === 200) {
                    setSuccess(`Succesfully Removed Client: ${client.clientid} from network ${client.network}.`)
                    fetchExternals()
                } else {
                    setError('Unable to remove key!')
                }
                setIsProcessing(false)
            } catch (err) {
                setError('Unable to remove key!')
                setIsProcessing(false)
            }
            setTimeout(() => {
                setSuccess('')
                setError('')
            }, 1000)
        }
    }

    const handleAccordianChange = (panel) => (event, isExpanded) => {
        event.preventDefault()
        setCurrentClient(isExpanded ? panel : false);
      };

    React.useEffect(() => {
        if( (data != null && externals.length === 0 && !hasChecked) || (data != null && !hasChecked) ) {
            fetchExternals()
        }
    }, )

    return (
        <Box justifyContent='flex-start' alignItems='stretch' className={classes.container}>
            <Modal
                aria-labelledby="gravitl"
                aria-describedby="Copy your Netmaker Access Token Value"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                disablePortal
                disableEnforceFocus
                disableAutoFocus
            >
                <div className={classes.paper}>
                    <Card className={classes.center}>
                        <CardContent>
                            <div className={classes.centerVert}>
                            { modalDisplay }
                            <Button variant='outlined' color='secondary' onClick={handleClose}>Close</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Modal>
            <Grid className={classes.main} container justify='center' >
                {isProcessing && 
                    <Grid item xs={10}>
                        <div className={classes.center}>
                            <CircularProgress />
                            <Typography variant='body1' color='textPrimary'>Loading...</Typography>
                        </div>
                    </Grid>
                }
                {error && 
                    <Grid item xs={10}>
                        <div className={classes.center}>
                            <Typography variant='body1' color='error'>{error}...</Typography>
                        </div>
                    </Grid>
                }
                {success && 
                    <Grid item xs={10}>
                        <div className={classes.center}>
                            <Typography variant='body1' color='primary'>{success}...</Typography>
                        </div>
                    </Grid>
                }
                {
                    <Grid item xs={12}>
                        <Grid container justifyContent='flex-start' alignItems='stretch'>
                            <Grid item xs={4}>
                                <div className={classes.center}><h4>Available Ingress Gateways</h4></div>
                                <div className={classes.cardContainer}>
                                { nodes.map(node => 
                                node.isingressgateway && (isAllNetworks || node.network === data.netid)  ?
                                <Card key={node.name+':'+node.macaddress} className={classes.cardBasic}>
                                    <CardHeader
                                        title={node.name}
                                        subheader={`Network: ${node.network}`}
                                        avatar={
                                            <SettingsInputAntenna />
                                        }
                                        action={
                                            <Tooltip title={`ADD CLIENT TO NETWORK ${node.network}?`} placement='top'>
                                                <IconButton aria-label={`add client to network, ${node.network}`} onClick={() => createNewClient(node.network, node.macaddress)}>
                                                <AddCircleOutline color='primary' />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    />
                                </Card>
                                 : null 
                                )}
                                {
                                    nodes.filter(node => node.isingressgateway && (isAllNetworks || node.network === data.netid)).length === 0 ? <div className={classes.center}><h5>No ingress gateways present.</h5></div> : null
                                }
                                </div>
                            </Grid>
                            <Grid xs={8}>
                                <div className={classes.center}><h4>External Clients</h4></div>
                                <div className={classes.cardContainer}>
                                {
                                    externals.length &&
                                    externals.map((external, i) =>
                                    data && (isAllNetworks || external.network === data.netid) ?
                                    <Accordion square={false} key={i} expanded={currentClient === external.clientid} onChange={handleAccordianChange(external.clientid)}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={`accordian-contents-${i}`}
                                            id={`panel1bh-header-${i}`}
                                        >
                                            <Typography className={classes.heading}>{external.clientid}</Typography>
                                            <Typography className={classes.secondaryHeading}>{external.network}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Card className={classes.cardBasic}>
                                                <CardHeader
                                                    title={external.clientid}
                                                    avatar={
                                                        <Devices />
                                                    }
                                                    action={
                                                        <Tooltip title={`EDIT CLIENT ${external.clientid}`} placement='top'>
                                                            <IconButton aria-label={`edit external client ${external.clientid}`} onClick={() => openModal(false, null, external)}>
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                />
                                                <CardContent>
                                                    <Grid container justifyContent='center' alignItems='space-around'>
                                                        <Grid item xs={5} className={classes.centerVert}>
                                                            <h5>IP - <strong>{external.address}</strong></h5>
                                                            <h5 style={{wordWrap:'break-word'}}>Public Key - <strong>{external.publickey}</strong></h5>
                                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'space-around'}}>
                                                                <Button variant='contained' onClick={() => getConfigFile(external)}>Download Config</Button>
                                                                <Tooltip title={`DELETE CLIENT ${external.clientid}?`} placement='top'>
                                                                    <IconButton aria-label={`delete external client ${external.clientid}`} onClick={() => deleteClient(external)}>
                                                                        <Delete color='secondary'/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={7}>
                                                            <div className={classes.center}>
                                                            {   qrCodes.length ? 
                                                                <img className={classes.qrImage} src={qrCodes[i]} alt={`Small QR code for client, ${external.clientid}.`} onClick={() => openModal(true, qrCodes[i], external)}/>
                                                                : <CircularProgress />}
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card> 
                                        </AccordionDetails>
                                    </Accordion>
                                    : null) 
                                }
                                {
                                    externals.filter(client => (isAllNetworks || client.network === data.netid)).length === 0 ? <div className={classes.center}><h5>No External clients present.</h5></div> : null
                                }
                                </div>
                            </Grid>
                        </Grid>                        
                    </Grid>
                }
            </Grid>
        </Box>
    )
}
