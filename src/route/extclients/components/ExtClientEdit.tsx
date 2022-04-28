import React, { useCallback } from 'react'
import { Grid, Modal, Typography, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch, useParams } from 'react-router'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { updateExternalClient } from '~store/modules/node/actions'
import { NmForm, NmFormInputText } from '~components/form'
import { nodeSelectors, authSelectors } from '~store/selectors'
import { grey } from '@mui/material/colors'

export const ExtClientEdit: React.FC<{}> = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const { netid, clientid } = useParams<{ netid: string; clientid: string }>()
  const newPath = `${path.split(':netid')[0]}${netid}`
  const dispatch = useDispatch()
  const inDarkMode = useSelector(authSelectors.isInDarkMode)
  const extClients = useSelector(nodeSelectors.getExtClients)
  const currentClient = extClients.filter((ec) => ec.clientid === clientid)[0]

  useLinkBreadcrumb({
    link: newPath,
    title: clientid,
  })

  useLinkBreadcrumb({
    title: t('common.edit'),
  })

  const handleSubmit = useCallback(
    (data: UpdateClient) => {
      if (!!currentClient) {
        dispatch(
          updateExternalClient.request({
            clientName: clientid,
            netid,
            newClientName: data.clientid,
            enabled: currentClient.enabled,
          })
        )
        history.goBack()
      }
    },
    [dispatch, clientid, netid, history, currentClient]
  )

  const handleClose = () => {
    history.push(newPath)
  }

  interface UpdateClient {
    clientid: string
  }

  const initialState: UpdateClient = {
    clientid: '',
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
      minWidth: '33%',
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
              {`${t('extclient.edit')} : ${clientid}`}
            </Typography>
          </Grid>
          <Grid item xs={10} style={boxStyle.center}>
            <NmForm
              initialState={initialState}
              onSubmit={handleSubmit}
              submitProps={{
                variant: 'contained',
                fullWidth: true,
              }}
            >
              <NmFormInputText
                name="clientid"
                defaultValue={clientid}
                label={String(t('extclient.clientid'))}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                autoComplete="false"
                autoFocus
              />
            </NmForm>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
