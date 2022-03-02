import React from 'react'
import { useDispatch } from 'react-redux'
import { NmLink } from '../../../components'
import { NmTable, TableColumns } from '../../../components/Table'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { useNetwork, useNodesByNetworkId } from '~util/network'
import CustomDialog from '~components/dialog/CustomDialog'
import { Button, Grid, Typography } from '@mui/material'
import { NetworkSelect } from '~components/NetworkSelect'
import { Node } from '~store/types'
import { CheckCircle } from '@mui/icons-material'

export const AllNodesACLTable: React.FC<{}> = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const [open, setOpen] = React.useState(false)
  const [selectedKey, setSelectedKey] = React.useState('')
  const { netid } = useParams<{ netid: string }>()
  const listOfNodes = useNodesByNetworkId(netid) || []
  const network = useNetwork(netid)
  const { url } = useRouteMatch()

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
  }

  const columns: TableColumns<Node> = [
    {
        id: 'id',
        label: t('node.name'),
        minWidth: 100,
        sortable: true,
        format: (value, row) => <NmLink sx={{textTransform: 'none'}} to={`/nodes/${netid}/${value}`}>{row.name}</NmLink>,
        align: 'left',
    },
  ]
  listOfNodes.map(node => columns.push(
  {
      id: 'id',
      label: ' ',
      minWidth: 50,
      sortable: true,
      format: () => <CheckCircle htmlColor='#2800ee' />,
      align: 'left',
  }))

  const handleClose = () => {
    setOpen(false)
    history.goBack()
  }

  // const handleOpen = (selected: string) => {
  //   setSelectedKey(selected)
  //   setOpen(true)
  // }

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
      <NmTable
        columns={columns}
        rows={listOfNodes}
        getRowId={(row) => row.id}
      />
      {selectedKey && (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            handleAccept={handleClose}
            message={t('acls.nodesconfirm')}
            title={`${t('common.submitchanges')} ${netid}`}
        />
      )}
    </Grid>
  )
}
