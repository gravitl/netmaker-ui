import React from 'react';
// //import Avatar from 'react-avatar';
// import { makeStyles } from '@material-ui/core/styles'
// import { BrowserRouter as Router } from 'react-router-dom'

// // import axios from 'axios'
// import MainTable from './Components/Views/MainTable.js';
// import TopBar from './Components/TopBar.js';
// import API from './Components/Utils/API'
// import USER from './Components/Utils/User'
// import { CircularProgress, Typography } from '@material-ui/core';
// import CreateNetwork from './Components/Views/CreateNetwork';
// import DateFnsUtils from '@date-io/date-fns';

import './App.css'
// import CreateUser from './Components/Views/CreateUser.js';
// import UpdateUser from './Components/Views/UpdateUser';
// import Login from './Components/Views/Login.js';
// import Fields from './Components/Utils/Fields';
// import {BACKEND_URL} from './config'
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import Routes from "./routes/routes"

// const useStyles = makeStyles((_) => ({
//   center: {
//       textAlign: 'center',
//       margin: '1em'
//   }
// }))
function App() {
  // const classes = useStyles()
  // const [networkData, setNetworkData] = useState([]); //table data
  // const [nodeData, setNodeData] = useState([]); //table data
  // const [dataSelection, setDataSelection] = useState(0)
  // const [networkSelection, setNetworkSelection] = useState(-1) 
  // const [isProcessing, setIsProcessing] = useState(false)
  // const [shouldUpdate, setShouldUpdate] = useState(true)
  // const [creatingNetwork, setCreatingNetwork] = useState(false)
  // const [creatingUser, setCreatingUser] = useState(false)
  // const [isLoggingIn, setIsLoggingIn] = useState(false)
  // const [success, setSuccess] = useState('')
  // const [user, setUser] = useState(null)
  // const [needsAdmin, setNeedsAdmin] = useState(false)
  // const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  // const [isBackend, setIsBackend] = useState(true)
  // const [error, setError] = useState('')
  // const [configDetails, setConfigDetails] = useState({})
  // const [networkNames, setNetworkNames] = useState([])

  // React.useEffect(() => {       
  //   let loginParam = USER.getParameterByName('login')
  //   if (loginParam && !user) {
  //     loginParam = Buffer.from(loginParam, 'base64').toString().split('   ')
  //     if (loginParam.length === 2) {
  //       const u = loginParam[0].trim()
  //       const t = loginParam[1].trim()
  //       const userProvided = USER.decode(u, t)
  //       if (userProvided) {
  //           setTimeout(() => {
  //             window.location.replace(window.location.href.split('?')[0])
  //         }, 200)  
  //       }
  //     }
  //   }
  //   USER.hasAdmin((hasAdmin, err) => { 
  //     if (err) {
  //       setIsBackend(false)
  //     } else {
  //       setIsBackend(true); 
  //       setNeedsAdmin(!hasAdmin); 
  //       if (!hasAdmin) setCreatingUser(true)} 
  //   })
  //   if (!isBackend) {
  //     setError(`Error connecting to backend. Given: ${Common.BACKEND_URL} \n Server may be down, address may be incorrect, or port may not be open. \n Please investigate.`)
  //     USER.logout(setUser, (needsLogin) => {})
  //   } else {
  //     if (!needsAdmin) {
  //       if (user) {
  //         if (shouldUpdate) {
  //           setShouldUpdate(false)
  //           setIsProcessing(true)
  //           // get server config
  //           API(user.token).get('/server/getconfig')
  //           .then(configRes => {
  //             setConfigDetails({...configRes.data})
  //           })
  //           .catch(error => {
  //             setConfigDetails({
  //               DNSMode: "off",
  //               EXTClients: "off",
  //               Version: "0.7.2"
  //             })
  //           })

  //           API(user.token).get("/networks") // get network data
  //           .then(networkRes => {  
  //               API(user.token).get("/nodes") // get node data
  //               .then(nodeRes => {
  //                   if (nodeRes.data && nodeRes.data.length > 0) setNodeData(nodeRes.data.sort(Fields.sortNodes) || [])
  //                   if (networkRes.data && networkRes.data.length > 0) {
  //                     setNetworkData(networkRes.data)
  //                     const currentNetworkNames = []
  //                     networkRes.data.map(network => {
  //                       currentNetworkNames.push(network.netid)
  //                     })
  //                     setNetworkNames(currentNetworkNames)
  //                   }
  //               })
  //               .catch(error=>{
  //                   if (networkRes.data && networkRes.data.length > 0) {
  //                     setNetworkData(networkRes.data)
  //                     const currentNetworkNames = []
  //                     networkRes.data.map(network => currentNetworkNames.push(network.netid))
  //                     setNetworkNames(currentNetworkNames)
  //                   }
  //                   setNodeData([])
  //                   setIsProcessing(false)
  //               }) 
  //           })
  //           .catch(error => {
  //               setIsProcessing(false)
  //           })
  //           setIsProcessing(false)
  //         } else if (networkData.length === 0 && !shouldUpdate) {
  //           setCreatingNetwork(true)
  //         }

  //         const interval = setInterval(() => {
  //           if (parseInt(Date.now()/1000) >= user.expiration) {
  //             USER.logout(setUser, setIsLoggingIn);
  //           } else {
  //             API(user.token).get("/nodes").then(nodeRes => {
  //               if (nodeRes.data && nodeRes.data.length >= 0 && nodeRes.data !== nodeData) {
  //                 setNodeData(nodeRes.data.sort(Fields.sortNodes))
  //               } else {
  //                 setNodeData([])
  //               }
  //             }).catch(err => {
  //               // node data could not be fetched..
  //               setNodeData([])
  //             })
  //           }
  //         }, 10000);
  //         return () => { clearInterval(interval);};
  //       } else {
  //         USER.getUser(setUser, setIsLoggingIn)
  //       }
  //     }
  //   }
  // }, [networkData, user, isBackend])

  return (<Routes />
    // <Router>
    //   <MuiPickersUtilsProvider utils={DateFnsUtils}>
    //     <div className="App">
    //       <TopBar configDetails={configDetails} setDataSelection={setDataSelection} setCreatingNetwork={setCreatingNetwork} currentUser={user} setUser={setUser} setIsLoggingIn={setIsLoggingIn} setIsUpdatingUser={setIsUpdatingUser} setCreatingUser={setCreatingUser} setError={setError} />
    //       {success ? <div className={classes.center}><Typography variant='h6' color='primary'>{success}</Typography></div> : null}
    //       {error ? <div className={classes.center}><Typography variant='h6' color='error'>{error}</Typography></div> : null}
    //       { error ? null : needsAdmin && creatingUser ? <CreateUser setIsCreating={setCreatingUser} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} isAdmin={needsAdmin} hasBack={!needsAdmin} user={user} /> :
    //         isLoggingIn ? <Login setIsLoggingIn={setIsLoggingIn} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} /> :
    //         isUpdatingUser ? <UpdateUser setIsUpdating={setIsUpdatingUser} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} currentUser={user}/> :
    //         creatingUser ? <CreateUser setIsCreating={setCreatingUser} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} networks={networkNames}/> :
    //         creatingNetwork ? <CreateNetwork setIsCreating={setCreatingNetwork} setSuccess={setSuccess} setShouldUpdate={setShouldUpdate} user={user} config={configDetails} /> : 
    //         isProcessing ? <div className={classes.center}><CircularProgress /></div> : 
    //         <MainTable 
    //           setCreatingNetwork={setCreatingNetwork} 
    //           setNetworkData={setNetworkData} 
    //           setNodeData={setNodeData} 
    //           setNetworkSelection={setNetworkSelection} 
    //           networkData={networkData} 
    //           nodeData={nodeData} 
    //           networkSelection={networkSelection} 
    //           dataSelection={dataSelection} 
    //           setSuccess={setSuccess}
    //           user={user}
    //           configDetails={configDetails}
    //         />
    //       }
    //     </div>
    //   </MuiPickersUtilsProvider>
    // </Router>
  )
}

export default App;
