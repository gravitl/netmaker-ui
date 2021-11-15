import * as React from 'react'
import Box from '@mui/material/Box'
import { Grid, IconButton, TextField, Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { useTranslation } from 'react-i18next'
import { ContentCopy } from '@mui/icons-material'
import copy from 'copy-to-clipboard'
import { grey } from '@mui/material/colors'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function AccessKeyDetails(Props: {
  title: string
  keyValue: string
  accessString: string
  handleOpen: () => void
  handleClose: () => void
  open: boolean
}) {
  const { t } = useTranslation()

  const styles = {
    centerStyle: {
      textAlign: 'center',
    },
    centeredText: {
      textAlign: 'center',
      overflowWrap: 'break-word',
    },
  } as any

  const getAgentInstallCommand = (accessToken: string) => {
    return `curl -sfL https://raw.githubusercontent.com/gravitl/netmaker/develop/scripts/netclient-install.sh | KEY=${accessToken} sh -`
  }

  return (
    <div>
      <Modal
        open={Props.open}
        onClose={Props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} style={styles.centerStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {Props.title}
              </Typography>
              <hr />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-evenly" alignItems="center">
              <Grid item xs={3} style={styles.centerStyle}>
                <h3>{t('accesskey.accesskey')}</h3>
              </Grid>
              <Grid item xs={7} style={styles.centerStyle}>
                <TextField
                  fullWidth
                  maxRows={1}
                  value={Props.keyValue}
                  sx={{ backgroundColor: grey[100] }}
                />
              </Grid>
              <Grid item xs={1} style={styles.centerStyle}>
                <Tooltip title={t('common.copy') as string} placement="top">
                  <IconButton onClick={() => copy(Props.keyValue)}>
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={3} style={styles.centerStyle}>
                <h3>{t('accesskey.accessToken')}</h3>
              </Grid>
              <Grid item xs={7} style={styles.centeredText}>
                <TextField
                  maxRows={1}
                  fullWidth
                  value={Props.accessString}
                  sx={{ backgroundColor: grey[100] }}
                />
              </Grid>
              <Grid item xs={1} style={styles.centerStyle}>
                <Tooltip
                  title={`${t('common.copy')} ${t('accesskey.accessToken')}`}
                  placement="top"
                >
                  <IconButton onClick={() => copy(Props.accessString)}>
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={3} style={styles.centerStyle}>
                <h3>{t('accesskey.installCommand')}</h3>
              </Grid>
              <Grid item xs={7} style={styles.centeredText}>
                <TextField
                  fullWidth
                  maxRows={1}
                  value={getAgentInstallCommand(Props.accessString)}
                  sx={{ backgroundColor: grey[100] }}
                />
              </Grid>
              <Grid item xs={1} style={styles.centerStyle}>
                <Tooltip
                  title={`${t('common.copy')} ${t('accesskey.installCommand')}`}
                  placement="top"
                >
                  <IconButton
                    onClick={() =>
                      copy(getAgentInstallCommand(Props.accessString))
                    }
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  )
}
