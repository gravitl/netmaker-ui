import { Box, Grid, Typography, CircularProgress, Card, CardContent, Modal, IconButton, Button, Tooltip } from '@material-ui/core'
import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DNS_API from '../Utils/DNS';
import { Backspace, Add, Sync } from '@material-ui/icons';

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
        alignItems: 'center'
    },
    btnTableCenter: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: '1em',
    },
    table2All: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: '1em',
    },
    cardMain: {
        width: '100%',
        marginTop: '1em',
    },
    container: {
        maxHeight: '28em',
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    backDrop: {
        background: 'rgba(255,0,0,1.0)',
    },
    table: {
        maxHeight: '20em',
        color: 'white',
        backgroundColor: 'black',
    },
    table2: {
        maxHeight: '20em',
        color: 'white',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
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

export default function DNS({ data, nodes }) {

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
            const dnsResponse = await DNS_API.removeEntry(data.netid, name)
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
            DNS_API.getDNS(data.netid, setDnsData)
            setShouldFetch(false)
            setCurrentNetworkName(data.netid)
        } else if (data != null && data.netid !== currentNetworkName) {
            setDnsData([])
            setShouldFetch(true)
        }
    },)

    return (
        <Box justifyContent='center' alignItems='flex-start' className={classes.container}>
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
                            <AddDnsEntry setOpen={setOpen} nodes={nodes} networkName={data.displayname} netid={data.netid} setShouldUpdate={setShouldFetch} />
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
                                    <Button style={{width: '33%'}} variant='outlined' onClick={handleOpen}>
                                        Add Entry{'  '}<Add />
                                    </Button>
                                </Tooltip>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className={classes.btnTableCenter}>
                            <TableContainer className={classes.table} component={Paper}>
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
                                    {  dnsData.length < 4 ? 
                                    <>
                                        <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                        <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                        <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                        <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                        <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                        <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                        <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                    </> : null }

                                    </TableBody>
                                </Table>
                                </TableContainer>
                                </div>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <div className={classes.table2All} >
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
                                        ) : null )}
                                        {(nodes.filter(node => node.network === data.netid)).length < 6 ?
                                        <>
                                            <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                            <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                            <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                            <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                            <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                            <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                            <StyledTableRow><StyledTableCell component="th" scope="row">{' '}</StyledTableCell><StyledTableCell component="th" scope="row">{' '}</StyledTableCell></StyledTableRow>
                                        </>
                                        : null}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </Grid>
                    </>
                    : <h3>Please select a specific network to view it's DNS.</h3> 
                }
            </Grid>
        </Box>
    )
}
