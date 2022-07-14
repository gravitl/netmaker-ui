import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NmLink } from '../../../components'
import { NmTable, TableColumns } from '../../../components/Table'
import { Delete } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { useNetwork } from '~util/network'
import CustomDialog from '~components/dialog/CustomDialog'
import { Button, Grid, Typography } from '@mui/material'
import { NetworkSelect } from '~components/NetworkSelect'
import { NetworkUser } from '~store/types'
import { deleteNetworkUser } from '~store/modules/pro/actions'
import { proSelectors } from '~store/selectors'

export const NetworkUsersTable: React.FC<{}> = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const [open, setOpen] = React.useState(false)
  const [selectedUserID, setSelectedUserID] = React.useState('')
  const { netid } = useParams<{ netid: string }>()
  const { url } = useRouteMatch()
  const netUsers = useSelector(proSelectors.networkUsers)

  if (!!!netUsers[netid] || !!!netUsers[netid].length) {
    return (
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">
              {`${netid}, ${t('pro.networkusers.none')}`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={5}>
          <NetworkSelect />
        </Grid>
      </Grid>
    )
  }

  const columns: TableColumns<NetworkUser> = [
    {
      id: 'id',
      label: t('node.id'),
      minWidth: 170,
      sortable: true,
      format: (value) => (
        <NmLink
          sx={{ textTransform: 'none' }}
          to={`/networkusers/${netid}/${value}`}
        >
          {value}
        </NmLink>
      ),
      align: 'center',
    },
  ]

  const handleClose = () => {
    setOpen(false)
    history.goBack()
  }

  const handleOpen = (selected: string) => {
    setSelectedUserID(selected)
    setOpen(true)
  }

  const handleDeleteNetworkUser = () => {
    dispatch(
      deleteNetworkUser.request({
        networkName: netid,
        networkUserID: selectedUserID,
      })
    )
    history.push(`/networkusers/${netid}`)
  }

  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Grid container 
              direction="row"
              display={'flex'}
              justifyContent="space-between"
              alignItems="center"
              marginLeft="4rem"
               >     
          <Grid item xs={8} md={5}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {`${t('accesskey.viewing')} ${netid}`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={10} md={3}>
            <NetworkSelect />
          </Grid>
          <Grid item xs={8} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => history.push(`${url}/create`)}
            >
              {`${t('common.create')} ${t('accesskey.accesskey')}`}
            </Button>
          </Grid>
        </Grid>
        <hr />
      </Grid>
      <NmTable
        columns={columns}
        rows={netUsers[netid]}
        getRowId={(row) => row.id}
        actions={[
          (row) => ({
            tooltip: t('common.delete'),
            disabled: false,
            icon: <Delete />,
            onClick: () => {
              handleOpen(row.id)
            },
          }),
        ]}
      />
      {selectedUserID && (
        <CustomDialog
          open={open}
          handleClose={handleClose}
          handleAccept={handleDeleteNetworkUser}
          message={t('accesskey.deleteconfirm')}
          title={`${t('common.delete')} ${selectedUserID}`}
        />
      )}
    </Grid>
  )
}
