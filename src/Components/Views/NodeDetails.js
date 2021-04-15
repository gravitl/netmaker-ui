import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateTimePicker from '@material-ui/lab/DateTimePicker';

import Fields from '../Utils/Fields'
import { Button, Typography, CircularProgress } from '@material-ui/core';
import API from '../Utils/API'

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2em'
  },
  textFieldRight: {
    marginLeft: theme.spacing(1),
  },
  textFieldLeft: {
      marginRight: theme.spacing(1)
  },
  center: {
      textAlign: 'center'
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
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
 }
}));

const readOnlyFields = [
    'macaddress',
    'network',
    'lastcheckin',
    'lastmodified',
]
const intFields = [
    'listenport',
    'persistentkeepalive'
]

const timeFields = [
    Fields.NODE_FIELDS[11],
    Fields.NODE_FIELDS[12],
]

const parseUpdatedNode = (nodes, macaddress) => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].macaddress === macaddress) {
            return nodes[i]
        }        
    }
    return null
}

const convertDateToUnix = (date) => {
    const unixTime = new Date(date).getTime() / 1000
    return unixTime
}

const MAX_TIME = 33174902665

export default function NodeDetails({ setNodeData, node, setSelectedNode, setSuccess, networkName }) {
  const classes = useStyles();
  const [isEditing, setIsEditing] = React.useState(false)
  const [settings, setSettings] = React.useState(null)
  const [currentSettings, setCurrentSettings] = React.useState(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setIsProcessing(true)
    try {
        const nodeData = { ...settings }
        const response = await API.put(`/nodes/${node.network}/${node.macaddress}`, nodeData)
        if (response.status === 200) {
            setCurrentSettings({...response.data})
            setSuccess(`Successfully updated node ${node.name}`)
            API.get("/nodes")
            .then(nodeRes => {               
                setNodeData(nodeRes.data)
                const updatedNode = parseUpdatedNode(nodeRes.data, node.macaddress)
                setTimeout(() => {
                    setSelectedNode(updatedNode)
                    setSettings(null)
                    setIsProcessing(false)
                    setSuccess('')
                }, 1000)
            })
            .catch(error => {
                setIsProcessing(false)
            }) 
        } else {
            setError(`Could not update node: ${node.name}.`)
            setIsProcessing(false)
        }
    } catch (err) {
        setError(`Could not update node: ${node.name}.`)
        setIsProcessing(false)
    }
  }

    const removeNode = async (nodeName, nodeMacAddress, network) => {
        if (window.confirm(`Are you sure you want to remove node: ${nodeName}?`)) {
            setIsProcessing(true)
            try {
                const response = await API.delete(`/nodes/${network}/${nodeMacAddress}`) 
                if (response.status === 200) {
                    setIsEditing(false); // return to network view
                    setSuccess(`Succesfully removed node: ${nodeName}!`)
                    setSelectedNode(null)
                    setTimeout(() => setSuccess(''), 1000)
                } else {
                    setError(`Could not remove node: ${nodeName}, please try again later.`)
                }
            } catch (err) {
                setError(`Server Error when removing: ${nodeName}, please check server connection.`)
            }
            setIsProcessing(false)
        }
    }

    const handleChange = event => {
        event.preventDefault()
        const { id, value } = event.target
        let newSettings = {...currentSettings}
        if (intFields.indexOf(id) !== -1) {
            newSettings[id] = parseInt(value)
        } else {
            newSettings[id] = value
        }
        setSettings(newSettings)
    }

    React.useEffect(() => {
        if (settings == null && node) {
            setSettings(node)
            setCurrentSettings(node)
        }
    }, [settings,node])

  return (
      <div>
          <form onSubmit={handleSubmit}>
            <Grid className={classes.main} justify='center' container>
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
                { settings ? <><Grid xs={12}>
                    <div className={classes.buttons}>
                        <Button className={classes.button} variant='outlined' disabled={isEditing} onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>
                        <Button className={classes.button} variant='outlined' disabled={!isEditing} type='submit'>
                            Save
                        </Button>
                        <Button className={classes.button} variant='outlined' disabled={!isEditing} onClick={() => {setIsEditing(false); setSettings(currentSettings);}}>
                            Cancel
                        </Button>
                        <Button className={classes.button2} variant='outlined' round onClick={() => removeNode(node.name, node.macaddress, networkName ? networkName : node.network)}>
                            Delete
                        </Button>
                        <Button className={classes.button} variant='outlined' round onClick={() => setSelectedNode(null)}>
                            Back
                        </Button>
                    </div>
                </Grid>
                <Grid xs={12} md={5}
                    direction='column'
                    item
                >
                    { Fields.NODE_FIELDS.map(fieldName => {
                        if (fieldName === 'expdatetime') {
                            return <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    value={new Date(Fields.datePickerConverter(settings[fieldName] > MAX_TIME ? MAX_TIME : settings[fieldName]))} //new Date(Fields.timeConverter(settings[fieldName] > MAX_TIME ? MAX_TIME : settings[fieldName])).toLocaleString()}
                                    onChange={(newValue) => {
                                        let newSettings = {...currentSettings}
                                        newSettings['expdatetime'] = convertDateToUnix(newValue)
                                        setSettings(newSettings)
                                    }}
                                    className={classes.textFieldLeft}
                                    disabled={!isEditing}
                                    onError={() => {
                                        setError('Please select valid date. May need to refresh, if misbehaving.')
                                        setTimeout(() => {
                                            setError('')
                                        }, 2000)
                                    }}
                                    label={fieldName.toUpperCase()}
                                    maxDate={new Date('3032-01-01T00:00')}
                                    minDate={new Date('2021-01-01T00:00')}
                                    inputFormat="yyyy/MM/dd hh:mm a"
                                    renderInput={params => <TextField 
                                        {...params}
                                        helperText='' 
                                        margin="normal" 
                                        className={classes.textFieldLeft}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        />}
                                />
                            </LocalizationProvider>
                        } else if (Fields.NODE_FIELDS.indexOf(fieldName) < Fields.NODE_FIELDS.length / 2) {
                            return <TextField
                                id={fieldName}
                                label={fieldName.toUpperCase()}
                                className={classes.textFieldLeft}
                                placeholder={timeFields.indexOf(fieldName) >= 0 ? Fields.timeConverter(settings[fieldName]) : settings[fieldName]}
                                value={timeFields.indexOf(fieldName) >= 0 ? Fields.timeConverter(settings[fieldName]) : settings[fieldName]}
                                fullWidth
                                key={Fields.makeKey(6)}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={!isEditing || readOnlyFields.indexOf(fieldName) >= 0}
                                variant="outlined"
                                onChange={handleChange}
                            />
                        } else {
                            return null
                        }
                        })}
                </Grid>
                <Grid xs={12} md={5}
                    direction='column'
                    item
                >
                    { Fields.NODE_FIELDS.map(fieldName => {
                        if (Fields.NODE_FIELDS.indexOf(fieldName) >= Fields.NODE_FIELDS.length / 2) {
                            return <TextField
                                id={fieldName}
                                label={fieldName.toUpperCase()}
                                className={classes.textFieldRight}
                                placeholder={timeFields.indexOf(fieldName) >= 0 ? Fields.timeConverter(settings[fieldName]) : settings[fieldName]}
                                value={timeFields.indexOf(fieldName) >= 0 ? Fields.timeConverter(settings[fieldName]) : settings[fieldName]}
                                fullWidth
                                key={Fields.makeKey(6)}
                                disabled={!isEditing || readOnlyFields.indexOf(fieldName) >= 0}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                onChange={handleChange}
                            />
                        } else {
                            return null
                        }
                    })}
                </Grid></> : <div className={classes.center}><h4>No Nodes found.</h4></div> }
            </Grid>
        </form>
      </div>
  );
}
