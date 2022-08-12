import React from 'react'
import { Grid, Modal, Typography, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch, useParams } from 'react-router'
import { nodeSelectors } from '~store/types'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { clearQr } from '~store/modules/node/actions'

export const QrCodeViewVpn: React.FC<{}> = () => {
  const history = useHistory()
  const qrCode = useSelector(nodeSelectors.getCurrentQrCode)
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const { netid, clientid } = useParams<{ netid: string; clientid: string }>()
  const newPath = `${path.split(':netid')[0]}${netid}`
  const dispatch = useDispatch()

  useLinkBreadcrumb({
    link: newPath,
    title: clientid,
  })

  useLinkBreadcrumb({
    title: 'qr',
  })

  const handleClose = () => {
    dispatch(clearQr())
    history.push(newPath)
  }

  if (!qrCode) {
    return (
      <div>
        <Typography variant="h5">{t('error.notfound')}</Typography>
      </div>
    )
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
      backgroundColor: 'white',
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
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} style={boxStyle.center}>
            <Typography variant="h5">
              {`${t('extclient.qr')} : ${clientid}`}
            </Typography>
          </Grid>
          <Grid item xs={12} style={boxStyle.center}>
            <img
              style={boxStyle.max}
              src={qrCode}
              alt={`QR code for client, ${clientid}.`}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
