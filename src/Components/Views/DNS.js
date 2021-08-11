import { Box, Grid, Typography, CircularProgress, Card, CardContent, Modal, IconButton, Button, Tooltip } from '@material-ui/core'
import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DNS_API from '../Utils/DNS';
import { Backspace, Add } from '@material-ui/icons';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AddDnsEntry from './AddDnsEntry'

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
        textAlign: 'center'
    },
    titleWithButton: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: '6px'
    },
    btnTableCenter: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginRight: '1em',
        marginLeft: '0.5em'
    },
    table2All: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    cardMain: {
        width: '100%',
        marginTop: '1em',
    },
    container: {
        maxHeight: '38em',
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
    main: {
        marginTop: '2em',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    backDrop: {
        background: 'rgba(255,0,0,1.0)',
    },
    table: {
        maxHeight: '30em',
        color: 'white',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    table2: {
        maxHeight: '30em',
        color: 'white',
        backgroundColor: 'black',
    },
  }));

  const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#3F51B5',
        color: '#FFF'
    },
    body: {
      fontSize: 16,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

export default function DNS({ data, nodes, user }) {

    const classes = useStyles()
    const [ isProcessing, setIsProcessing ] = React.useState(false)
    const [ error, setError ] = React.useState('')
    const [ success, setSuccess ] = React.useState('')
    const [ open, setOpen ] = React.useState(false)
    const [ dnsData, setDnsData ] = React.useState([])
    const [ shouldFetch, setShouldFetch ] = React.useState(true)
    const [ currentNetworkName, setCurrentNetworkName ] = React.useState('')

    const resetNotifications = () => {
        setTimeout(() => {
            setSuccess('')
            setError('')
        }, 1500)
    }

    const handleClose = () => {
        setOpen(false)
    }    

    const removeEntry = async name => {
        if (data && window.confirm(`Are you sure you want to remove entry for ${name}.${data.netid}?`)) {
            const dnsResponse = await DNS_API.removeEntry(data.netid, name, user.token)
            if (dnsResponse) {
                setSuccess(`Removed entry ${name}.`)
                setShouldFetch(true)
            } else {
                setError(`Could not remove entry ${name}.`)
            }
            resetNotifications()
        }
    }

    const headerStyle = {
        color: 'white'
    }

    const handleOpen = () => {
        setOpen(true)
    }

    React.useEffect(() => {
        if (data && shouldFetch) {
            DNS_API.getDNS(data.netid, setDnsData, user.token)
            setShouldFetch(false)
            setCurrentNetworkName(data.netid)
        } else if (data != null && data.netid !== currentNetworkName) {
            setDnsData([])
            setShouldFetch(true)
        }
    },)

    return (
        <Box justifyContent='flex-start' alignItems='stretch'>
            {data ? 
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
                            <AddDnsEntry 
                                user={user} 
                                setOpen={setOpen} 
                                nodes={nodes} 
                                networkName={data.displayname} 
                                netid={data.netid} 
                                setShouldUpdate={setShouldFetch}
                            />
                        </CardContent>
                    </Card>
                </div>
            </Modal>
            : null}
            <Grid className={classes.main} container justifyContent='center' >
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
                    data ? 
                    <>
                        <Grid item xs={12}>
                            <div className={classes.titleWithButton}>
                                <Tooltip title={`Add DNS entry for network, ${data.netid}?`}>
                                    <Button style={{width: '33%', marginBottom: '0.5em'}} variant='outlined' onClick={handleOpen}>
                                        Add Entry{'  '}<Add />
                                    </Button>
                                </Tooltip>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TableContainer className={classes.table2} component={Paper}>
                                <Table aria-label="customized table">
                                    <TableHead>
                                    <TableRow>
                                        <StyledTableCell style={headerStyle}>Custom DNS</StyledTableCell>
                                        <StyledTableCell style={headerStyle} align="right">{' '}</StyledTableCell>
                                        <StyledTableCell style={headerStyle} align="right">{' '}</StyledTableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {dnsData.map(dnsEntry => (
                                        <StyledTableRow key={dnsEntry.name}>
                                            <StyledTableCell component="th" scope="row">
                                                {`${dnsEntry.name}.${dnsEntry.network}`}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{dnsEntry.address}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Tooltip title={`REMOVE DNS ENTRY: ${dnsEntry.name}.${dnsEntry.network}?`} placement='top'><IconButton style={{height: '100%'}} onClick={() => removeEntry(dnsEntry.name, dnsEntry.address)}><Backspace /></IconButton></Tooltip>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                    {  
                                        dnsData.length === 0 ? 
                                        <StyledTableRow>
                                            <StyledTableCell component="th" scope="row">
                                            No entries present.
                                            </StyledTableCell>
                                            <StyledTableCell align="right"></StyledTableCell>
                                            <StyledTableCell align="center"></StyledTableCell>
                                        </StyledTableRow> : null 
                                    }
                                    </TableBody>
                                </Table>
                                </TableContainer>
                        </Grid>
                        <Grid item xs={12} md={6}>
                                <TableContainer className={classes.table2} component={Paper}>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                        <TableRow>
                                            <StyledTableCell style={headerStyle}>Node DNS (Default)</StyledTableCell>
                                            <StyledTableCell style={headerStyle} align="right">{' '}</StyledTableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {nodes.map(node => node.network === data.netid ? (
                                            <StyledTableRow key={node.name}>
                                                <StyledTableCell component="th" scope="row">
                                                    {`${node.name}.${node.network}`}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{node.address}</StyledTableCell>
                                            </StyledTableRow>
                                        ) : null
                                        )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                        </Grid>
                    </>
                    : <h3>Please select a specific network to view it's DNS.</h3> 
                }
            </Grid>
        </Box>
    )
}
