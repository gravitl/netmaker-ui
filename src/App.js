import React, { useState } from 'react';
//import Avatar from 'react-avatar';
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter as Router } from 'react-router-dom'

// import axios from 'axios'
import MainTable from './Components/Views/MainTable.js';
import TopBar from './Components/TopBar.js';
import API from './Components/Utils/API'
import USER from './Components/Utils/User'
import { CircularProgress, Typography } from '@material-ui/core';
import CreateNetwork from './Components/Views/CreateNetwork';

import './App.css'
import CreateUser from './Components/Views/CreateUser.js';
import UpdateUser from './Components/Views/UpdateUser';
import Login from './Components/Views/Login.js';
import Common from './Common'

const styles = {
  center: {
      textAlign: 'center',
      margin: '1em'
  }
}

/*
function validateEmail(email){
  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}
*/

const useStyles = makeStyles(styles)
function App() {

  const classes = useStyles()
  const [networkData, setNetworkData] = useState([]); //table data
  const [nodeData, setNodeData] = useState([]); //table data
  const [dataSelection, setDataSelection] = useState(0)
  const [networkSelection, setNetworkSelection] = useState(-1) 
  const [isProcessing, setIsProcessing] = useState(false)
  const [shouldUpdate, setShouldUpdate] = useState(true)
  const [creatingNetwork, setCreatingNetwork] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState(null)
  const [needsAdmin, setNeedsAdmin] = useState(false)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [isBackend, setIsBackend] = useState(true)
  const [error, setError] = useState('')

  React.useEffect(() => { 
    USER.hasAdmin((hasAdmin, err) => { 
      if (err) {
        setIsBackend(false)
      } else {
        setIsBackend(true); 
        setNeedsAdmin(!hasAdmin); 
        if (!hasAdmin) setCreatingUser(true)} 
    })
    if (!isBackend) {
      setError(`Incorrect backend detected. Please specify correct URL and refresh.\nGiven: ${Common.BACKEND_URL}`)
      USER.logout(setUser, (needsLogin) => {})
    } else {
      if (!needsAdmin) {
        if (user) {
          if (shouldUpdate) {
            setShouldUpdate(false)
            setIsProcessing(true)
            API.get("/networks")
            .then(networkRes => {  
                API.get("/nodes")     
                .then(nodeRes => {
                    if (nodeRes.data && nodeRes.data.length > 0) setNodeData(nodeRes.data)
                    if (networkRes.data && networkRes.data.length > 0) setNetworkData(networkRes.data)
                    setIsProcessing(false)
                })
                .catch(error=>{
                    setIsProcessing(false)
                }) 
            })
            .catch(error => {
                setIsProcessing(false)
            })
          } else if (networkData.length === 0 && !shouldUpdate) {
            setCreatingNetwork(true)
          }

          const userInterval = setInterval(() => {
            USER.getUser(setUser, setIsLoggingIn)
          }, 1000 * 60 * 5);

          const interval = setInterval(() => {
            API.get("nodes").then(nodeRes => {
              if (nodeRes.data && nodeRes.data.length >= 0 && nodeRes.data !== nodeData) {
                setNodeData(nodeRes.data)
              } else {
                setNodeData([])
              }
            }).catch(err => {
              // node data could not be fetched..
              setNodeData([])
            })
          }, 10000);
          return () => { clearInterval(interval); clearInterval(userInterval) };
        } else {
          USER.getUser(setUser, setIsLoggingIn)
        }
      }
    }
  }, [networkData, user, isBackend])

  return (
    <Router>
      <div className="App">
        <TopBar setDataSelection={setDataSelection} setCreatingNetwork={setCreatingNetwork} currentUser={user} setUser={setUser} setIsLoggingIn={setIsLoggingIn} setIsUpdatingUser={setIsUpdatingUser} />
        {success ? <div className={classes.center}><Typography variant='h6' color='primary'>{success}</Typography></div> : null}
        {error ? <div className={classes.center}><Typography variant='h6' color='error'>{error}</Typography></div> : null}
        { error ? null : needsAdmin && creatingUser ? <CreateUser setIsCreating={setCreatingUser} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} isAdmin={needsAdmin} hasBack={!needsAdmin}/> :
          isLoggingIn ? <Login setIsLoggingIn={setIsLoggingIn} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} /> :
          isUpdatingUser ? <UpdateUser setIsUpdating={setIsUpdatingUser} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} currentUser={user}/> :
          creatingUser ? <CreateUser setIsCreating={setCreatingUser} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} /> :
          creatingNetwork ? <CreateNetwork setIsCreating={setCreatingNetwork} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} /> : 
          isProcessing ? <div className={classes.center}><CircularProgress /></div> : 
          <MainTable setNetworkData={setNetworkData} setNodeData={setNodeData} setNetworkSelection={setNetworkSelection} networkData={networkData} nodeData={nodeData} networkSelection={networkSelection} dataSelection={dataSelection} setSuccess={setSuccess} />
        }
      </div>
    </Router>
  )
}

export default App;
