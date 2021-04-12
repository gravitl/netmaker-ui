import { Box, Grid, Button, Typography, CircularProgress, Card, CardContent, Modal, Backdrop, IconButton, Tooltip } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import API from '../Utils/API';
import { FilterNone, Delete } from '@material-ui/icons';
import copy from 'copy-to-clipboard'
import CreateKey from './CreateKey'

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    cardMain: {
        width: '100%',
        marginTop: '1em',
    },
    container: {
        maxHeight: '28em',
        overflowY: 'scroll',
        overflow: 'hidden',
        borderRadius: '8px'
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
    }
  }));

export default function OtkDetails({ data }) {

    const classes = useStyles()

    const [ accessKeys, setAccessKeys ] = React.useState([])
    const [ hasChecked, setHasChecked ] = React.useState(false)
    const [ isProcessing, setIsProcessing ] = React.useState(false)
    const [ currentData, setCurrentData ] = React.useState({})
    const [ error, setError ] = React.useState('')
    const [ success, setSuccess ] = React.useState('')
    const [ open, setOpen ] = React.useState(false)
    const [ modalText, setModalText ] = React.useState('')
    const [ isCreating, setIsCreating ] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
        setModalText('')
    }

    const fetchKeys = async () => {
        setHasChecked(true)
        if (data && data.nameid) {
            setIsProcessing(true)
            setError('')
            try {
                const response = await API.get(`/groups/${data.nameid}/keys`)
                console.log(response)
                if (response.status === 200) {
                    setAccessKeys(response.data ? response.data : null)
                } else {
                    setError('Unable to fetch Keys!')
                }
                setIsProcessing(false)
            } catch (err) {
                setError('Unable to fetch Keys!')
                setIsProcessing(false)
            }
        }
    }

    const getAgentInstallCommand = () => {
        return `curl -sfL https://raw.githubusercontent.com/gravitl/netmaker/v0.1/netclient-install.sh | -t ${modalText} sh -`
    }

    const createNewKey = async (event, keyName, keyUses) => {
        event.preventDefault()
        if (data && data.nameid) {
            setIsCreating(false)
            setIsProcessing(true)
            setError('')
            try {
                const response = await API.post(`/groups/${data.nameid}/keys`, {
                    name: keyName,
                    uses: keyUses
                })
                if (response.status === 200) {
                    setModalText(response.data)
                    setOpen(true)
                    setCurrentData(null)
                } else {
                    setError('Unable to create new key!')
                }
                setIsProcessing(false)
            } catch (err) {
                setError('Unable to create new key!')
                setIsProcessing(false)
            }
        }
    }

    const deleteKey = async (keyName) => {
        if (data && data.nameid && keyName) {
            if (window.confirm(`Are you sure you want to remove key: ${keyName}?`)) {
                setIsProcessing(true)
                setError('')
                try {
                    const response = await API.delete(`/groups/${data.nameid}/keys/${keyName}`)
                    if (response.status === 200) {
                        // set success or something
                        setSuccess(`Succesfully Removed Key: ${keyName}.`)
                        setCurrentData(null)
                        setTimeout(() => {
                            setSuccess('')
                        }, 1000)
                    } else {
                        setError('Unable to remove key!')
                    }
                    setIsProcessing(false)
                } catch (err) {
                    setError('Unable to remove key!')
                    setIsProcessing(false)
                }
            }
        }
    }

    const copyToClipboard = (e) => {
        // textArea.select();
        copy(modalText)
    };

    React.useEffect(() => {
        if( (data != null && accessKeys && accessKeys.length === 0 && !hasChecked) || (data != null && !hasChecked) ) {
            fetchKeys()
        } else if (data !== currentData) {
            fetchKeys()
            setCurrentData(data)
        }
    }, )

    return (
        <Box justifyContent='center' alignItems='center' className={classes.container}>
            <Modal
                aria-labelledby="gravitl"
                aria-describedby="Copy your Netmaker Access Token Value"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Card className={classes.center}>
                    <CardContent>
                        <h4>Your Access Token: </h4>
                        <h5>{modalText}<Tooltip title={'COPY ACCESS TOKEN'} placement='top'><IconButton variant="outlined" onClick={copyToClipboard}><FilterNone /></IconButton></Tooltip></h5>
                        <p>Please save your key as you will be unable to access it again.</p>
                        <h5>Your agent install command with access token:</h5>
                        <h6>{getAgentInstallCommand()}<Tooltip title={'COPY AGENT INSTALL COMMAND'} placement='top'><IconButton variant="outlined" onClick={() => copy(getAgentInstallCommand())}><FilterNone /></IconButton></Tooltip></h6>
                    </CardContent>
                </Card>
            </Modal>
            <Grid container justify='center' >
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
                    isCreating ? <CreateKey setIsCreating={setIsCreating} setSuccess={setSuccess} handleSubmit={createNewKey} /> :
                    data ? 
                    <>
                        <Grid item xs={12}>
                            <div className={classes.center}>
                                <Button className={classes.button} variant='outlined' onClick={() => setIsCreating(true)}>Add New Access Key</Button>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                        {
                            accessKeys != null && accessKeys.length ?
                            accessKeys.map(accessKey => (
                                <Card key={accessKey.nameid} className={classes.cardMain}>
                                    <CardContent>
                                        <Grid container justify='center' alignItems='center' >
                                            <Grid item xs={4} className={classes.center}><h3>Name: {accessKey.name}</h3></Grid>
                                            <Grid item xs={4} className={classes.center}><h3>Uses: {accessKey.uses}</h3></Grid>
                                            <Grid item xs={4} className={classes.center}><Button className={classes.button2} onClick={() => deleteKey(accessKey.name)} variant="outlined">Delete Key{' '}<Delete /></Button></Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )) : null
                        }
                        </Grid>
                    </>
                    : <h3>Please select a specific group to view it's access keys.</h3> 
                }
            </Grid>
        </Box>
    )
}
