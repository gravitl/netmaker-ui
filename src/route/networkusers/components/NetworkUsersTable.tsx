import React from 'react'
import { useSelector } from 'react-redux'
import { NmLink } from '../../../components'
import { NmTable, TableColumns } from '../../../components/Table'
import { Edit } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { Grid, Typography } from '@mui/material'
import { NetworkSelect } from '~components/NetworkSelect'
import { NetworkUser } from '~store/types'
import { proSelectors } from '~store/selectors'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'

export const NetworkUsersTable: React.FC<{}> = () => {
  const { t } = useTranslation()
  const history = useHistory()
  // const [open, setOpen] = React.useState(false)
  const { netid } = useParams<{ netid: string }>()
  const { url } = useRouteMatch()
  const netUsers = useSelector(proSelectors.networkUsers)

  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

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
          to={`/user-permissions/${netid}/${value}`}
        >
          {value}
        </NmLink>
      ),
      align: 'center',
    },
    {
      id: 'id',
      label: t('node.nodes'),
      minWidth: 170,
      sortable: true,
      format: (_, obj) => (<span>
        {obj.nodes.map(n => 
          <NmLink
            sx={{ textTransform: 'none' }}
            to={`/nodes/${netid}/${n}`}
          >
            {n}
          </NmLink>)}
        </span>
      ),
      align: 'center',
    },
    {
      id: 'id',
      label: t('extclient.extclients'),
      minWidth: 170,
      sortable: true,
      format: (_, obj) => (
        <NmLink
          sx={{ textTransform: 'none' }}
          to={`/ext-clients/${netid}`}
        >
          {obj.clients.join(',')}
        </NmLink>
      ),
      align: 'center',
    },
  ]

  // const handleClose = () => {
  //   setOpen(false)
  // }

  // const handleOpen = (selected: string) => {
  //   setSelectedUserID(selected)
  //   setOpen(true)
  // }

  // const handleDeleteNetworkUser = () => {
  //   dispatch(
  //     deleteNetworkUser.request({
  //       networkName: netid,
  //       networkUserID: selectedUserID,
  //     })
  //   )
  //   history.push(`/user-permissions/${netid}`)
  // }

  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Grid container 
              direction="row"
              display={'flex'}
              justifyContent="space-evenly"
              alignItems="center"
              marginLeft="4rem"
               >     
          <Grid item xs={8} md={6}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {`${netid} ${t('pro.label.userpermissions')}`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={10} md={5}>
            <NetworkSelect />
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
            tooltip: `${t('common.edit')} ${row.id}`,
            disabled: false,
            icon: <Edit />,
            onClick: () => {
              history.push(`/user-permissions/${netid}/${row.id}`)
            },
          }),
          // (row) => ({
          //   tooltip: `${t('common.delete')} ${row.id}`,
          //   disabled: false,
          //   icon: <Delete />,
          //   onClick: () => {
          //     handleOpen(row.id)
          //   },
          // }),
        ]}
      />
      {/* {selectedUserID && (
        <CustomDialog
          open={open}
          handleClose={handleClose}
          handleAccept={handleDeleteNetworkUser}
          message={t('pro.networkusers.deleteconfirm')}
          title={`${t('common.delete')} ${selectedUserID}`}
        />
      )} */}
    </Grid>
  )
}
