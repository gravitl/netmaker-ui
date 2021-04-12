import React from 'react'

import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NodeDetails from './NodeDetails'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit'
import CheckBox from '@material-ui/icons/CheckBox'
import IconButton from '@material-ui/core/IconButton'

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
    text: {
        color: '#000000'
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

export default function AllNodes({ setNodeData, nodes, groupName, setSuccess, isAllGroups, }) {

    const classes = useStyles()
    const [selectedNode, setSelectedNode] = React.useState(null)
    const [error, setError] = React.useState('')
    const [success, setApprovalSuccess] = React.useState('')

    const handleNodeSelect = node => {
        setSelectedNode(node)
    }

    const doesGroupHaveNodes = () => {
        if (nodes && !nodes.length) return false 
        return nodes.filter(node => node.group === groupName).length > 0
    }

    const getSelectedNode = () => {
        return selectedNode
    }

    const approveNode = async (group, macaddress, name) => {
        // address:port/api/group/nodes/macaddress/uncordon
        if (window.confirm(`Are you certain you want to approve node ${name} with MAC ${macaddress}?`)) {
            try {
                const response = await API.post(`/${group}/nodes/${macaddress}/uncordon`)
                console.log(response)
                if (response.status === 200) {
                    setApprovalSuccess(`Approved node, ${name}!`)
                } else {
                    setError(`Unable to approve node, ${name}.`)
                }
            } catch (err) {
                setError(`Unable to approve node, ${name}.`)
            }

            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.container}>
            <Grid item xs={10}>
            {success ? <div className={classes.center}><Typography variant='h6' color='primary'>{success}</Typography></div> : null}
            {error ? <div className={classes.center}><Typography variant='h6' color='error'>{error}</Typography></div> : null}
            {!selectedNode ? <div className={classes.nodeTitle2}><Typography variant='h5'>{isAllGroups ? 'All' : groupName} nodes</Typography></div> : null }
            {isAllGroups || doesGroupHaveNodes() ? null : <div className={classes.nodeTitle}><h3>No nodes present in group: {groupName}...</h3></div>}
            {selectedNode ? <NodeDetails setNodeData={setNodeData} node={getSelectedNode()} setSelectedNode={setSelectedNode} setSuccess={setSuccess} groupName={groupName}/> :
            nodes && nodes.length ? nodes.map(node => 
                groupName && node.group === groupName ? 
                <Card className={classes.row}>
                    <CardHeader
                        title={node.name  + (node.ispending ? ' (Approval Required)' : '')}
                        subheader={`public: ${node.endpoint} | private: ${node.address} | status: ${(Date.now()/1000) - node.lastcheckin >= 1800 ? 'ERROR' : 
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
                            {displayedNodeFields.map(fieldName => (
                                <Grid item className={classes.cell} key={node.macaddress} xs={12} md={fieldName === 'listenport' ? 3 : 4}>
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
                                    <IconButton aria-label={`approve node ${node.name}`} onClick={() => approveNode(node.group, node.macaddress, node.name)}>
                                    <CheckBox />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            : null}
                        </Grid>
                    </CardContent>
                </Card> :
                isAllGroups ? <>
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
                                <IconButton aria-label={`edit group ${node.name}`} onClick={() => handleNodeSelect(node)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <CardContent>
                        <Grid container justify='center' alignItems='center'>
                            {displayedNodeFields.map(fieldName => (
                                <Grid item className={classes.cell} key={node.macaddress} xs={12} md={fieldName === 'listenport' ? 3 : 4}>
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
                                    <IconButton aria-label={`approve node ${node.name}`} onClick={() => approveNode(node.group, node.macaddress, node.name)}>
                                    <CheckBox />
                                    </IconButton>
                                </Tooltip>
                            </Grid> : null }
                        </Grid>
                    </CardContent>
                </Card></>
                  : null
            ) : nodes && !nodes.length ? null : <div className={classes.nodeTitle}><h3>There are no nodes...</h3></div>
        }        
            {isAllGroups && !nodes.length ? <div className={classes.nodeTitle}><h3>There are no nodes...</h3></div> : null}
            </Grid>
        </Grid>
    )
}
