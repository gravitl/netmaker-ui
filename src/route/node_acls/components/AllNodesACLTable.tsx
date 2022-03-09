import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NmLink } from '../../../components'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { useNetwork, useNodesByNetworkId } from '~util/network'
import CustomDialog from '~components/dialog/CustomDialog'
import { Button, Grid, IconButton, InputAdornment, LinearProgress, TextField, Typography } from '@mui/material'
import { NetworkSelect } from '~components/NetworkSelect'
import { CheckCircle, NotInterested as NotAllowedIcon, RemoveCircleOutline as DisabledIcon, Search } from '@mui/icons-material'
import { getNodeACLContainer } from '~store/modules/acls/actions'
import { aclSelectors } from '~store/selectors'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { NodeACL, NodeACLContainer } from '~store/types'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'

export const AllNodesACLTable: React.FC<{}> = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { url } = useRouteMatch()
  const history = useHistory()
  const [open, setOpen] = React.useState(false)
  const { netid } = useParams<{ netid: string }>()
  const listOfNodes = useNodesByNetworkId(netid) || []
  const network = useNetwork(netid)
  const isProcessing = useSelector(aclSelectors.isProcessing)
  const currentNetworkACL = useSelector(aclSelectors.getCurrentACL)
  const currentNodeACLs = Object.keys(currentNetworkACL)
  const [editableNetworkACL, setEditableNetworkACL] = React.useState(currentNetworkACL)
  var nodeNameMap : Map<string, string> = new Map()
  var filteredNameMap : Map<string, string> = new Map()
  const [ filterNodes, setFilterNodes ] = React.useState(listOfNodes)

  const handleFilter = (event: {target: {value: string}}) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterNodes(listOfNodes)
    } else {
      setFilterNodes(listOfNodes.filter(node => `${node.name}${node.address}${node.id}`.includes(searchTerm)))
    }
  }

  useLinkBreadcrumb({
    link: url,
    title: decodeURIComponent(netid),
  })

  React.useEffect(() => {
    if (currentNodeACLs.length === 0) {
      dispatch(getNodeACLContainer.request({ netid }))
    }
    if (Object.keys(editableNetworkACL).length !== currentNodeACLs.length) {
      console.log(`Setting temp network to ${currentNetworkACL}`)
      setEditableNetworkACL(currentNetworkACL)
    }
  }, [ dispatch, netid, currentNetworkACL, currentNodeACLs, setEditableNetworkACL, editableNetworkACL ])

  if (!!!network) {
    return <Grid container justifyContent="space-between" alignItems="center">
      <Grid item xs={6}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="h4">
              {`${netid}, ${t('network.none')}`}
          </Typography>
        </div>
      </Grid>
      <Grid item xs={5}>
        <NetworkSelect />
      </Grid>
    </Grid>
  } else if (isProcessing || currentNodeACLs.length === 0) {
    return <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant="h4">
                {`${t('common.loading')} ${t('header.acls')}`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={10} sx={{marginTop: '3em'}}>
          <LinearProgress />
        </Grid>
      </Grid>
  }

  listOfNodes.map(node => nodeNameMap.set(node.id, node.name))
  if (!!filterNodes.length && filterNodes.length !== listOfNodes.length) {
    filteredNameMap = new Map()
    filterNodes.map(node => filteredNameMap.set(node.id, node.name))
  }

  const handleRuleUpdate = (node1ID : string, node2ID : string) => {
    const newACLs = {} as NodeACLContainer
    if (!!!newACLs[node1ID]) { // handle changed nodes
      newACLs[node1ID] = {} as NodeACL
    }
    if (!!!newACLs[node2ID]) {
      newACLs[node2ID] = {} as NodeACL
    }
    if (!!!newACLs[node1ID][node2ID]) {
      newACLs[node1ID][node2ID] = editableNetworkACL[node1ID][node2ID]
    }
    if (!!!newACLs[node2ID][node1ID]) {
      newACLs[node2ID][node1ID] = editableNetworkACL[node2ID][node1ID] 
    }
    if (newACLs[node1ID][node2ID] === 2) {
      newACLs[node1ID][node2ID] = 1
      newACLs[node2ID][node1ID] = 1
    } else {
      newACLs[node1ID][node2ID] = 2
      newACLs[node2ID][node1ID] = 2
    }
    
    for (let i = 0; i < currentNodeACLs.length; i++) { // loop through all "outer" nodes to make a deep copy
      const currentAclIDs = Object.keys(editableNetworkACL[currentNodeACLs[i]]) // get node's acl
      if (!!!newACLs[currentNodeACLs[i]]) {
        newACLs[currentNodeACLs[i]] = {} as NodeACL
      }
      for (let j = 0; j < currentAclIDs.length; j++) { // loop through all nodes within node's acl
        if (!!!newACLs[currentNodeACLs[i]][currentAclIDs[j]]) {
          newACLs[currentNodeACLs[i]][currentAclIDs[j]] = editableNetworkACL[currentNodeACLs[i]][currentAclIDs[j]]
        }  
        if (currentNodeACLs[i] === currentAclIDs[j] || (currentAclIDs[j] === node1ID || currentAclIDs[j] === node2ID)) continue // skip adding self to lists
        newACLs[currentNodeACLs[i]][currentAclIDs[j]] = editableNetworkACL[currentNodeACLs[i]][currentAclIDs[j]]
      }
    }
    
    setEditableNetworkACL(newACLs)
  }

  // fill others currentNodeACLs
  const getACLCellRender = (nodeID : string, loopID : string) => {
    // if it's this node's index, render disabled thing
    if (nodeID === loopID) { // looking at self
      return <DisabledIcon color='inherit' />
    }
    return <IconButton onClick={() => handleRuleUpdate(nodeID, loopID)}>
        {(!!editableNetworkACL[nodeID] && !!editableNetworkACL[nodeID][loopID] && editableNetworkACL[nodeID][loopID] === 2) ? 
          <CheckCircle htmlColor='#2800ee' /> : 
          <NotAllowedIcon color='error' />
        }
    </IconButton>
  }

  const stickyColStyle = {
    position: "sticky",
    left: 0,
    background: "#E8E8E8",
    zIndex: 1,
  }

  const handleClose = () => {
    setOpen(false)
    history.goBack()
  }

  const handleReset = () => {
    setEditableNetworkACL(currentNetworkACL)
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={4}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {`${t('acls.nodeview')} ${netid}`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={2}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
              label={`${t('common.search')} ${t('node.nodes')}`} 
              onChange={handleFilter} 
            />
          </Grid>
          <Grid item xs={2}>
            <NetworkSelect />
          </Grid>
          <Grid item xs={3}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
                fullWidth
                variant="contained"
                onClick={() => console.log('submitting')}
            >
                {`${t('common.submitchanges')}`}
            </Button>
            <Button
                fullWidth
                variant="outlined"
                color='secondary'
                sx={{marginTop: '1rem'}}
                onClick={handleReset}
            >
                {`${t('common.reset')}`}
            </Button>
            </div>
        </Grid>
        </Grid>
        <hr />
      </Grid>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
      <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="acl-table">
        <TableHead>
          <TableRow>
            <TableCell>{t('node.name')}</TableCell>
            {
              currentNodeACLs.map(nodeID => <TableCell align='center' key={nodeID}><NmLink sx={{textTransform: 'none', background: "#E8E8E8"}} to={`/nodes/${netid}/${nodeID}`}>{nodeNameMap.get(nodeID)}</NmLink></TableCell>)
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {currentNodeACLs.map((currentACLID) => filteredNameMap.size === 0 || filteredNameMap.has(currentACLID) ? (
            <TableRow
              key={currentACLID}
              sx={{'&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={stickyColStyle} component="th" scope="row">
                <NmLink sx={{textTransform: 'none'}} to={`/nodes/${netid}/${currentACLID}`}>{nodeNameMap.get(currentACLID)}</NmLink>
              </TableCell>
              {
                currentNodeACLs.map((loopACLID) => (
                  <TableCell key={`${loopACLID}-2`} align='center'>{getACLCellRender(currentACLID, loopACLID)}</TableCell>
                ))
              }
            </TableRow>
          ) : null)}
        </TableBody>
      </Table>
      </TableContainer>
      </Paper>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        handleAccept={handleClose}
        message={t('acls.nodesconfirm')}
        title={`${t('common.submitchanges')} ${netid}`}
      />
    </Grid>
  )
}
