import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NmLink } from '../../../../components'
import { AccessKey } from '../../../../store/modules/network'
import { NmTable, TableColumns } from '../../../../components/Table'
import { Delete } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { deleteAccessKey } from '~store/modules/network/actions'
import CustomDialog from '~components/dialog/CustomDialog'
import { Button, Grid, Typography } from '@mui/material'
import { proSelectors } from '~store/selectors'

export const ProAccessKeyTable: React.FC<{}> = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const [open, setOpen] = React.useState(false)
  const [selectedKey, setSelectedKey] = React.useState('')
  const { netid } = useParams<{ netid: string }>()
  const userData = useSelector(proSelectors.networkUserData)[netid]
  const network = userData.networks.filter((net) => net.netid === netid)[0]
  const { url } = useRouteMatch()

  if (!!!network) {
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
              {`${netid}, ${t('network.none')}`}
            </Typography>
          </div>
        </Grid>
      </Grid>
    )
  }

  const columns: TableColumns<AccessKey> = [
    {
      id: 'name',
      label: t('accesskey.accesskey'),
      minWidth: 170,
      sortable: true,
      format: (value) => (
        <NmLink
          sx={{ textTransform: 'none' }}
          to={`/access-keys/${netid}/details/${value}`}
        >
          {value}
        </NmLink>
      ),
      align: 'center',
    },
    {
      id: 'uses',
      labelKey: 'accesskey.uses',
      minWidth: 100,
      sortable: true,
      align: 'center',
    },
  ]

  const handleClose = () => {
    setOpen(false)
    history.goBack()
  }

  const handleOpen = (selected: string) => {
    setSelectedKey(selected)
    setOpen(true)
  }

  const handleDeleteAccesKey = () => {
    dispatch(
      deleteAccessKey.request({
        netid,
        name: selectedKey!,
      })
    )
    history.push(`/access-keys/${netid}`)
  }

  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Grid
          container
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
        rows={network.accesskeys}
        getRowId={(row) => row.name}
        actions={[
          (row) => ({
            tooltip: t('common.delete'),
            disabled: false,
            icon: <Delete />,
            onClick: () => {
              handleOpen(row.name)
            },
          }),
        ]}
      />
      {selectedKey && (
        <CustomDialog
          open={open}
          handleClose={handleClose}
          handleAccept={handleDeleteAccesKey}
          message={t('accesskey.deleteconfirm')}
          title={`${t('common.delete')} ${selectedKey}`}
        />
      )}
    </Grid>
  )
}
