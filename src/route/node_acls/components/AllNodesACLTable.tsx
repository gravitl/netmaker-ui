import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NmLink } from '../../../components'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory } from 'react-router-dom'
import { useNetwork, useNodesByNetworkId } from '~util/network'
import CustomDialog from '~components/dialog/CustomDialog'
import { Button, Grid, LinearProgress, TablePagination, Typography } from '@mui/material'
import { NetworkSelect } from '~components/NetworkSelect'
import { CheckCircle, NotInterested as NotAllowedIcon, RemoveCircleOutline as DisabledIcon } from '@mui/icons-material'
import { getNodeACLContainer } from '~store/modules/acls/actions'
import { aclSelectors } from '~store/selectors'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export const AllNodesACLTable: React.FC<{}> = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const [open, setOpen] = React.useState(false)
  const { netid } = useParams<{ netid: string }>()
  const listOfNodes = useNodesByNetworkId(netid) || []
  const network = useNetwork(netid)
  const isProcessing = useSelector(aclSelectors.isProcessing)
  const currentNetworkACL = useSelector(aclSelectors.getCurrentACL)
  const currentNodeACLs = Object.keys(currentNetworkACL)
  const nodeNameMap : Map<string, string> = new Map()

  React.useEffect(() => {
    if (currentNodeACLs.length === 0) {
      dispatch(getNodeACLContainer.request({ netid }))
    }
  }, [ dispatch, netid, currentNetworkACL, currentNodeACLs ])

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
                {`${netid}, ${t('network.none')}`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={10} sx={{marginTop: '3em'}}>
          <LinearProgress />
        </Grid>
      </Grid>
  }

  listOfNodes.map(node => nodeNameMap.set(node.id, node.name))

  // fill others currentNodeACLs
  const getACLCellRender = (nodeID : string, loopID : string) => {
    // if it's this node's index, render disabled thing
    if (nodeID === loopID) { // looking at self
      return <DisabledIcon color='inherit' />
    }
    if (currentNetworkACL[nodeID][loopID] === 1) {
      return <NotAllowedIcon color='error' />
    }
    return <CheckCircle htmlColor='#2800ee' />
  }

  const handleClose = () => {
    setOpen(false)
    history.goBack()
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={5}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {`${t('acls.nodeview')} ${netid}`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={3}>
            <NetworkSelect />
          </Grid>
          <Grid item xs={3}>
            <Button
                fullWidth
                variant="contained"
                onClick={() => console.log('submitting')}
            >
                {`${t('common.submitchanges')}`}
            </Button>
        </Grid>
        </Grid>
        <hr />
      </Grid>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{t('node.name')}</TableCell>
            {
              currentNodeACLs.map(nodeID => <TableCell align='center' key={nodeID}><NmLink sx={{textTransform: 'none'}} to={`/nodes/${netid}/${nodeID}`}>{nodeNameMap.get(nodeID)}</NmLink></TableCell>)
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {currentNodeACLs.map((currentACLID) => (
            <TableRow
              key={currentACLID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <NmLink sx={{textTransform: 'none'}} to={`/nodes/${netid}/${currentACLID}`}>{nodeNameMap.get(currentACLID)}</NmLink>
              </TableCell>
              {
                currentNodeACLs.map((loopACLID) => (
                  <TableCell key={`${loopACLID}-2`} align='center'>{getACLCellRender(currentACLID, loopACLID)}</TableCell>
                ))
              }
            </TableRow>
          ))}
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
