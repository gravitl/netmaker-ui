import React from 'react'

import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NodeDetails from './NodeDetails'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Modal from '@material-ui/core/Modal'
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit'
import AccountTree from '@material-ui/icons/AccountTree'
import CheckBox from '@material-ui/icons/CheckBox'
import Cancel from '@material-ui/icons/Cancel'
import LowPriority from '@material-ui/icons/LowPriority'
import IconButton from '@material-ui/core/IconButton'
import GatewayCreate from './GatewayCreate'

import API from '../Utils/API'
import Util from '../Utils/Fields'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center'
    },
    row: {
        marginBottom: '0.5em',
        marginTop: '1em',
    },
    center: {
        textAlign: 'center'
    },
    cell: {
        padding: '0.5em',
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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paperModal: {
        position: 'absolute',
        width: '60%',
        backgroundColor: theme.palette.background.paper,
        outline: 0, // Disable browser on-focus borders
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    text: {
        color: '#000000'
    },
    gateway: {
        color: '#3F51B5',
        fontSize: '2em',
        marginLeft: '1em'
    }
}));

const displayedNodeFields = [
    'publickey',
    'listenport',
    'lastcheckin'
]

const WARNING = '#ffcc00'
const ERROR = '#ED4337'
const HEALTHY = '#11772d'

export default function AllNodes({ setNodeData, nodes, networkName, setSuccess, isAllNetworks, networks }) {

    const classes = useStyles()
    const [selectedNode, setSelectedNode] = React.useState(null)
    const [error, setError] = React.useState('')
    const [success, setApprovalSuccess] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [gatewayNode, setGatewayNode] = React.useState(null)

    const handleNodeSelect = node => {
        setSelectedNode(node)
    }

    const doesNetworkHaveNodes = () => {
        if (nodes && !nodes.length) return false 
        return nodes.filter(node => node.network === networkName).length > 0
    }

    const getSelectedNode = () => {
        return selectedNode
    }

    const handleRemoveGateway = async (node) => {
        if (window.confirm(`Are you certain you want to remove gateway on node: ${node.name}?`)) {
            try {
                const response = await API.delete(`/nodes/${node.network}/${node.macaddress}/deletegateway`)
                if (response.status === 200) {
                    setApprovalSuccess(`Successfully removed gateway from, ${node.name}!`)
                } else {
                    setError(`Unable to remove gateway from node, ${node.name}.`)
                }
            } catch (err) {
                setError(`Server error occurred, unable to remove gateway from node, ${node.name}.`)
            }
            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    const approveNode = async (network, macaddress, name) => {
        if (window.confirm(`Are you certain you want to approve node ${name} with MAC ${macaddress}?`)) {
            try {
                const response = await API.post(`/nodes/${network}/${macaddress}/approve`)
                if (response.status === 200) {
                    setApprovalSuccess(`Approved node, ${name}!`)
                } else {
                    setError(`Unable to approve node, ${name}.`)
                }
            } catch (err) {
                setError(`Unable to approve node - Server Error, ${name}.`)
            }

            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpening = node => {
        setGatewayNode(node)
        setOpen(true)
    } 

    return (
        <Grid container justify='center' alignItems='center' className={classes.container}>
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
                <div className={classes.paperModal}>
                    <GatewayCreate setSuccess={setApprovalSuccess} setOpen={setOpen} gatewayNode={gatewayNode} networks={networks} />
                </div>
            </Modal>
            <Grid item xs={10}>
            {success ? <div className={classes.center}><Typography variant='h6' color='primary'>{success}</Typography></div> : null}
            {error ? <div className={classes.center}><Typography variant='h6' color='error'>{error}</Typography></div> : null}
            {!selectedNode ? <div className={classes.nodeTitle2}><Typography variant='h5'>{isAllNetworks ? 'All' : networkName} nodes</Typography></div> : null }
            {isAllNetworks || doesNetworkHaveNodes() ? null : <div className={classes.nodeTitle}><h3>No nodes present in network: {networkName}...</h3></div>}
            {selectedNode ? <NodeDetails setNodeData={setNodeData} node={getSelectedNode()} setSelectedNode={setSelectedNode} setSuccess={setSuccess} networkName={networkName} networkData={networks} /> :
            nodes && nodes.length ? nodes.map(node => 
                networkName && node.network === networkName ? 
                <Card className={classes.row}>
                    <CardHeader
                        title={node.name  + (node.ispending ? ' (Approval Required)' : '')}
                        subheader={`public ip: ${node.endpoint} | subnet ip: ${node.address} | status: ${(Date.now()/1000) - node.lastcheckin >= 1800 ? 'ERROR' : 
                            (Date.now()/1000) - node.lastcheckin >= 300 ? 'WARNING' : 'HEALTHY'}`}
                        avatar={
                            <Avatar aria-label={node.name} style={{ backgroundColor:
                                (Date.now()/1000) - node.lastcheckin >= 1800 ? ERROR : 
                                (Date.now()/1000) - node.lastcheckin >= 300 ? WARNING : HEALTHY }}>
                                {node.name.toUpperCase().substring(0,1)}
                            </Avatar>
                        }
                        action={
                            <Tooltip title='EDIT' placement='top'>
                                <IconButton aria-label={`edit node ${node.name}`} onClick={() => handleNodeSelect(node)}>
                                <Edit />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <CardContent>
                        <Grid container justify='center' alignItems='center'>
                            <Grid item xs={2} md={1}>
                                { node.isgateway ?
                                <Tooltip title={`REMOVE GATEWAY for ${node.gatewayrange}?`} placement='top'>
                                    <IconButton aria-label={`remove gateway access for node, ${node.name}.`} onClick={() => handleRemoveGateway(node)}>
                                        <Cancel />
                                    </IconButton>
                                </Tooltip> : 
                                <Tooltip title={`MAKE ${node.name} A GATEWAY NODE?`} placement='top'>
                                    <IconButton aria-label={`make node, ${node.name}, a gateway`} onClick={() => handleOpening(node)} disabled={node.ispending}>
                                        <AccountTree />
                                    </IconButton>
                                </Tooltip> 
                                }
                            </Grid>
                            {displayedNodeFields.map(fieldName => (
                                <Grid item className={classes.cell} key={node.macaddress} xs={fieldName === displayedNodeFields[0] || (node.isgateway && fieldName === displayedNodeFields[2])? 12 : 10} md={3}>
                                    <TextField
                                            id="filled-full-width"
                                            label={fieldName.toUpperCase()}
                                            placeholder={fieldName === displayedNodeFields[2] ? Util.timeConverter(node[fieldName]) : node[fieldName]}
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
                            {node.ispending ? 
                            <Grid item xs={12} md={1}>
                                <Tooltip title='APPROVE' placement='top'>
                                    <IconButton aria-label={`approve node ${node.name}`} onClick={() => approveNode(node.network, node.macaddress, node.name)}>
                                    <CheckBox />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            : null}
                            {node.isgateway ? 
                            <Grid item xs={1} md={1}>
                                <Tooltip title={`${node.name} IS A GATEWAY`} placement='top'>
                                    <LowPriority className={classes.gateway} />
                                </Tooltip>
                            </Grid>
                            : null}
                        </Grid>
                    </CardContent>
                </Card>:
                isAllNetworks ? <>
                <Card key={node.macaddress} className={classes.row}>
                    <CardHeader
                        title={node.name + (node.ispending ? ' (Approval Required)' : '')}
                        subheader={`public ip: ${node.endpoint} | subnet ip: ${node.address} | status: ${(Date.now()/1000) - node.lastcheckin >= 1800 ? 'ERROR' : 
                        (Date.now()/1000) - node.lastcheckin >= 300 ? 'WARNING' : 'HEALTHY'}` }
                        avatar={
                            <Avatar aria-label={node.name} style={{ backgroundColor: 
                                (Date.now()/1000) - node.lastcheckin >= 1800 ? ERROR : 
                                (Date.now()/1000) - node.lastcheckin >= 300 ? WARNING : HEALTHY }}>
                                {node.name.toUpperCase().substring(0,1)}
                            </Avatar>
                        }
                        action={
                            <Tooltip title='EDIT' placement='top'>
                                <IconButton aria-label={`edit network ${node.name}`} onClick={() => handleNodeSelect(node)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <CardContent>
                        <Grid container justify='center' alignItems='center'>
                            <Grid item xs={2} md={1}>
                                { node.isgateway ?
                                <Tooltip title={`REMOVE GATEWAY for ${node.gatewayrange}?`} placement='top'>
                                    <IconButton aria-label={`remove gateway access for node, ${node.name}.`} onClick={() => handleRemoveGateway(node)}>
                                        <Cancel />
                                    </IconButton>
                                </Tooltip> : 
                                <Tooltip title={`MAKE ${node.name} A GATEWAY NODE?`} placement='top'>
                                    <IconButton aria-label={`make node, ${node.name}, a gateway`} onClick={() => handleOpening(node)} disabled={node.ispending}>
                                        <AccountTree />
                                    </IconButton>
                                </Tooltip> 
                                }
                            </Grid>
                            {displayedNodeFields.map(fieldName => (
                                <Grid item className={classes.cell} key={node.macaddress} xs={fieldName === displayedNodeFields[0] || (node.isgateway && fieldName === displayedNodeFields[2])? 12 : 10} md={3}>
                                    <TextField
                                            className={classes.text}
                                            id="filled-full-width"
                                            label={fieldName.toUpperCase()}
                                            placeholder={fieldName === displayedNodeFields[2] ? Util.timeConverter(node[fieldName]) : node[fieldName]}
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
                            {node.ispending ? 
                            <Grid item xs={12} md={1}>
                                <Tooltip title='APPROVE' placement='top'>
                                    <IconButton aria-label={`approve node ${node.name}`} onClick={() => approveNode(node.network, node.macaddress, node.name)}>
                                    <CheckBox />
                                    </IconButton>
                                </Tooltip>
                            </Grid> : null }
                            {node.isgateway ? 
                            <Grid item xs={1} md={1}>
                                <Tooltip title={`${node.name} IS A GATEWAY`} placement='top'>
                                    <LowPriority className={classes.gateway} />
                                </Tooltip>
                            </Grid>
                            : null}
                        </Grid>
                    </CardContent>
                </Card></>
                  : null
            ) : nodes && !nodes.length ? null : <div className={classes.nodeTitle}><h3>There are no nodes...</h3></div>
        }        
            {isAllNetworks && !nodes.length ? <div className={classes.nodeTitle}><h3>There are no nodes...</h3></div> : null}
            </Grid>
        </Grid>
    )
}
