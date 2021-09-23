import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Fields from '../Utils/Fields'
import { Button } from '@material-ui/core';
import API from '../Utils/API'

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2em',
    marginBottom: '2em'
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
  main: {
      marginBottom: '3em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
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

const readOnlyFields = [
    'nodeslastmodified',
    'networklastmodified',
]

const boolFields = [
    'defaultsaveconfig',
    'isdualstack',
    'defaultudpholepunch'
]

const boolFieldValues = {
    defaultsaveconfig : 'Default SaveConfig',
    isdualstack: 'Dual Stack',
    defaultudpholepunch: 'UDP Hole Punching'
}

const intFields = [
    'defaultlistenport',
    'defaultkeepalive',
    'defaultcheckininterval',
    'defaultmtu',
]

const timeFields = [
    "nodeslastmodified",
    "networklastmodified"
]

const correctIPRegex = new RegExp(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i)

export default function NetworkDetails({ networkData, setSelectedNetwork, back, setSuccess, setNetworkData, user, config }) {
  const classes = useStyles();
  const [isEditing, setIsEditing] = React.useState(false)
  const [settings, setSettings] = React.useState(null)
  const [currentSettings, setCurrentSettings] = React.useState(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [error, setError] = React.useState('')
  const [allowManual, setAllowManual] = React.useState(false)
  const [change, setChange] = React.useState(false)


  const handleSubmit = async event => {
    event.preventDefault()
    setIsProcessing(true)
    try {
        settings.defaultextclientdns = settings.defaultextclientdns.trim()
        if (!(settings.defaultextclientdns === "" || correctIPRegex.test(settings.defaultextclientdns))) {
            setError("incorrect ip value given for ext client default DNS")
            setIsProcessing(false)
            setTimeout(() => {
                setError('')
            }, 1000)
            return
        }
        const response = await API(user.token).put(`/networks/${networkData.netid}`, { ...settings, allowmanualsignup: allowManual ? "yes" : "no" })
        if (response.status === 200) {
            setCurrentSettings(settings) // set what we've changed.
            setSuccess(`Successfully updated network ${networkData.displayname}`)
            setTimeout(() => {
                setSuccess('')
                API(user.token).get("/networks")
                .then(networksRes => {         
                    setNetworkData(networksRes.data)
                    setCurrentSettings(networksRes.data)
                    setIsProcessing(false)
                    setSettings(null)
                })
                .catch(error => {
                    setIsProcessing(false)
                })
            }, 1000)
        } else {
            setError(`Could not update network: ${networkData.displayname}.`)
        }
    } catch (err) {
        setError(`Could not update network: ${networkData.displayname}.`)
    }
    setIsProcessing(false)
    setTimeout(() => {
        setSuccess('')
        setError('')
    }, 3000)
  }

  const handleChange = event => {
    event.preventDefault()
    const { id, value } = event.target
    let newSettings = {...settings}
    if (intFields.indexOf(id) !== -1) {
        newSettings[id] = parseInt(value)
    } else {
        newSettings[id] = value
    }
    setSettings(newSettings)
    setChange(true)
  }

  const handleBoolChange = (event, fieldName) => {
    event.preventDefault()
    let newSettings = {...settings}
    newSettings[fieldName] = event.target.checked ? "yes" : "no"
    if (!event.target.checked && fieldName === 'isdualstack') {
        newSettings.addressrange6 = ''
    }
    setSettings(newSettings)
    setChange(true)
  }

  const toggleManual = event => {
      event.preventDefault()
      setAllowManual(!allowManual)
  }

  const removeNetwork = async networkName => {
    if (window.confirm(`Are you sure you want to remove network ${networkName}?`)) {
        setIsProcessing(true)
        try {
            const response = await API(user.token).delete(`/networks/${networkName}`) 
            if (response.status === 200) {
                setIsEditing(false); // return to network view
                setSuccess(`Succesfully removed network: ${networkName}!`)
                setSettings(null)
                setTimeout(() => {
                    setSuccess('')
                    window.location.reload()
                }, 1000)
            } else {
                setError(`Could not remove network: ${networkName}, please remove all nodes and try again.`)
            }
        } catch (err) {
            setError(`Server error occurred when removing: ${networkName}, please check connection and try again.`)
        }
    }
    setTimeout(() => {
        setSuccess('')
        setError('')
    }, 3000)
    setIsProcessing(false)
  }

  React.useEffect(() => {
        if (settings == null && networkData) {
            setAllowManual(networkData.allowmanualsignup === "yes")
            setSettings(networkData)
            setCurrentSettings(networkData)
        } else if (settings != null && networkData !== settings && !change) {
            setSettings(null)
        }
  }, [settings, networkData])

  const IS_UDP_ENABLED = (field) => config && config.ClientMode == "off" && field === "defaultudpholepunch"

  return (
      <div>
          <form >
            <Grid justify='center' alignItems='center' container className={classes.main}>
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
                <Grid item xs={12}>
                    <div className={classes.buttons}>
                        <Button className={classes.button} variant='outlined' disabled={isEditing} onClick={() => { setIsEditing(true) }}>
                            Edit
                        </Button>
                        <Button className={classes.button} variant='outlined' disabled={!isEditing} onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button className={classes.button} variant='outlined' disabled={!isEditing} onClick={() => { setIsEditing(false); setSettings(currentSettings); }}>
                            Cancel
                        </Button>
                        <Button className={classes.button2} variant='outlined' onClick={() => removeNetwork(networkData.netid)}>
                            Delete
                        </Button>
                        {back && 
                            <Button className={classes.button} variant='outlined' onClick={() => setSelectedNetwork(null)}>
                                Back
                            </Button>
                        }
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.center}>
                        <FormControlLabel
                            disabled={!isEditing}
                            control={<Switch checked={allowManual} disabled={!isEditing} onChange={toggleManual} color='primary' name="allowManual" />}
                            label={"Allow Node Signup Without Keys"}
                        />
                    </div>
                </Grid>
                { networkData && settings && Fields.NETWORK_FIELDS.map(fieldName => {
                    return fieldName !== 'accesskeys' ? 
                            <Grid item xs={12} md={5}>
                                {boolFields.indexOf(fieldName) >= 0 ? 
                                <div className={classes.center}>
                                    <Tooltip title={IS_UDP_ENABLED(fieldName) ? 
                                        'UDP Hole Punching disabled when client mode is off.' : ''} placement='top'>
                                    <FormControlLabel
                                        control={
                                        <Switch
                                            checked={settings[fieldName] === "yes"}
                                            onChange={(event) => handleBoolChange(event, fieldName)}
                                            name={fieldName}
                                            color="primary"
                                            disabled={!isEditing || readOnlyFields.indexOf(fieldName) >= 0 || IS_UDP_ENABLED(fieldName)}
                                            id={fieldName}
                                        />
                                        }
                                        label={Fields.NETWORK_DISPLAY_NAME[fieldName]}
                                    /></Tooltip></div> :
                                <TextField
                                    id={fieldName}
                                    label={Fields.NETWORK_DISPLAY_NAME[fieldName]}
                                    className={classes.textFieldLeft}
                                    placeholder={timeFields.indexOf(fieldName) >= 0 ? Fields.timeConverter(settings[fieldName]) : settings[fieldName]}
                                    value={timeFields.indexOf(fieldName) >= 0 ? Fields.timeConverter(settings[fieldName]) : settings[fieldName]}
                                    key={fieldName}
                                    fullWidth
                                    disabled={!isEditing || readOnlyFields.indexOf(fieldName) >= 0 || (settings.isdualstack === "no" && fieldName === 'addressrange6')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    onChange={handleChange}
                                />}
                            </Grid> : null
                    })}
            </Grid>
        </form>
      </div>
  );
}
