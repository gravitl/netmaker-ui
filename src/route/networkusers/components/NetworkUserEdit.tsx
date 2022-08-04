import React, { useCallback } from 'react'
import { Grid, Modal, Typography, Box, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch, useParams } from 'react-router'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NmForm, NmFormInputText } from '~components/form'
import { proSelectors, authSelectors } from '~store/selectors'
import { grey } from '@mui/material/colors'
import { NetworkUser } from '~store/types'
import { updateNetworkUser } from '~store/modules/pro/actions'
import { NmLink } from '~components/Link'

export const NetworkUserEdit: React.FC<{}> = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { url } = useRouteMatch()
  const { netid, clientid } = useParams<{ netid: string; clientid: string }>()
  const dispatch = useDispatch()
  const currentUsers = useSelector(proSelectors.networkUsers)
  let currentClient = undefined as NetworkUser | undefined
  if (!!currentUsers && !!currentUsers[netid]) {
    currentClient = currentUsers[netid].filter(
      (user) => user.id === clientid
    )[0]
  }
  const inDarkMode = useSelector(authSelectors.isInDarkMode)

  useLinkBreadcrumb({
    link: url,
    title: clientid,
  })

  useLinkBreadcrumb({
    link: url.split('/' + clientid)[0],
    title: netid,
  })

  useLinkBreadcrumb({
    title: t('common.edit'),
  })

  const handleSubmit = useCallback(
    (data: NetworkUser) => {
      if (!!currentClient) {
        let newClient = {
          ...data,
          accesslevel: Number(data.accesslevel),
          nodelimit: Number(data.nodelimit),
          clientlimit: Number(data.clientlimit),
        }

        dispatch(
          updateNetworkUser.request({
            networkName: netid,
            networkUser: { ...newClient },
          })
        )
        history.push(`/networkusers/${netid}`)
      }
    },
    [dispatch, netid, history, currentClient]
  )

  const handleClose = () => {
    history.push(`/networkusers/${netid}`)
  }

  if (!!!currentClient) {
    return (
      <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
        <Typography variant="h5">{`${t('error.notfound')}`}</Typography>
      </div>
    )
  }

  const initialState: NetworkUser = {
    ...currentClient,
  }

  const boxStyle = {
    modal: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      backgroundColor: inDarkMode ? '#272727' : grey[100],
      border: '1px solid #000',
      minWidth: '50%',
      // boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3,
    },
    center: {
      textAlign: 'center',
    },
    max: {
      width: '75%',
    },
  } as any

  return (
    <Modal open={true} onClose={handleClose}>
      <Box style={boxStyle.modal}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ margin: '0.5em' }}
        >
          <Grid item xs={12} style={boxStyle.center}>
            <Typography variant="h5">
              {`${t('common.edit')} ${t('pro.label.networkuser')}: ${clientid}`}
            </Typography>
          </Grid>
          <Grid item xs={12} style={boxStyle.center}>
            <NmForm
              initialState={initialState}
              onSubmit={handleSubmit}
              submitProps={{
                variant: 'contained',
                fullWidth: true,
                type: 'submit',
              }}
            >
              <Grid
                container
                justifyContent={'space-evenly'}
                alignItems="center"
              >
                <Grid item xs={9}>
                  <NmFormInputText
                    name="id"
                    defaultValue={clientid}
                    label={String(t('node.id'))}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    autoComplete="false"
                    disabled
                  />
                </Grid>
                <Grid item xs={4} md={3.1}>
                  <Tooltip
                    title={t('pro.helpers.accesslevel') as string}
                    placement="top"
                  >
                    <NmFormInputText
                      defaultValue={currentClient.accesslevel}
                      name="accesslevel"
                      label={String(t('pro.networkusers.accesslevel'))}
                      type="number"
                      autoFocus
                    />
                  </Tooltip>
                </Grid>
                <Grid item sm={4} md={3.1}>
                  <Tooltip
                    title={t('pro.helpers.usernodelimit') as string}
                    placement="top"
                  >
                    <NmFormInputText
                      defaultValue={currentClient.nodelimit}
                      name="nodelimit"
                      label={String(t('pro.networkusers.nodelimit'))}
                      type="number"
                    />
                  </Tooltip>
                </Grid>
                <Grid item sm={4} md={3.1}>
                  <Tooltip
                    title={t('pro.helpers.userclientlimit') as string}
                    placement="top"
                  >
                    <NmFormInputText
                      defaultValue={currentClient.clientlimit}
                      name="clientlimit"
                      label={String(t('pro.networkusers.clientlimit'))}
                      type="number"
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={11} sm={10} md={9}>
                  <Grid
                    container
                    justifyContent={'space-evenly'}
                    alignItems="center"
                    sx={{ marginTop: '1rem' }}
                  >
                    <Grid item xs={12} md={8} style={{ textAlign: 'center' }}>
                      <NmFormInputText
                        fullWidth
                        name="groups"
                        label={String(t('pro.networkusers.groups'))}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={8} md={3.75} style={{ textAlign: 'center' }}>
                      <NmLink
                        variant="outlined"
                        fullWidth
                        sx={{ textTransform: 'none' }}
                        to={`/networkusers/${netid}/${clientid}/groups`}
                      >
                        {`${t('common.edit')} ${t('pro.networkusers.groups')}`}
                      </NmLink>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </NmForm>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
