import * as React from 'react'
import Box from '@mui/material/Box'
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { useTranslation } from 'react-i18next'
import { ContentCopy } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { serverSelectors } from '~store/types'
import copy from 'copy-to-clipboard'
import { grey } from '@mui/material/colors'
import { authSelectors } from '~store/selectors'

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

const extractVersion = (v: string | undefined) => {
  if (!!!v) {
    return 'latest'
  }
  if (v.charAt(0) === 'v' || v.charAt(0) === 'V') {
    return v
  }
  return `v${v}`
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
  const version = extractVersion(
    useSelector(serverSelectors.getServerConfig).Version
  )
  const inDarkMode = useSelector(authSelectors.isInDarkMode)

  const styles = {
    centerStyle: {
      textAlign: 'center',
    },
    centeredText: {
      textAlign: 'center',
      overflowWrap: 'break-word',
    },
  } as any

  const getDockerRunCommand = (accessToken: string) => {
    return `docker run -d --network host  --privileged -e TOKEN=${accessToken} -v /etc/netclient:/etc/netclient --name netclient gravitl/netclient:${version}`
  }

  const getJoinCommand = (accessToken: string) => {
    return `netclient join -t ${accessToken}`
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
              <Typography
                id="modal-modal-title"
                variant="h5"
                style={{ marginBottom: '0.5em' }}
              >
                {Props.title}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-evenly" alignItems="center">
              <Grid item xs={3} style={styles.centerStyle}></Grid>
              <Grid item xs={7} style={styles.centerStyle}>
                <Typography
                  style={{
                    minWidth: '25vw',
                    marginBottom: '0.5em',
                    marginTop: '0.5em',
                    marginRight: '35rem',
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{ color: 'inherit' }}
                    href="https://docs.netmaker.org/client-install.html"
                  >
                    <h3>{t('common.clickinstall')}</h3>
                  </Button>
                </Typography>
              </Grid>
              <Grid item xs={3} style={styles.centerStyle}>
                <h3>{t('accesskey.accesskey')}</h3>
              </Grid>
              <Grid item xs={7} style={styles.centerStyle}>
                <TextField
                  fullWidth
                  maxRows={1}
                  value={Props.keyValue}
                  sx={{
                    backgroundColor: inDarkMode ? '#272727' : grey[100],
                  }}
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
                  sx={{
                    backgroundColor: inDarkMode ? '#272727' : grey[100],
                  }}
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
                <h3>{t('accesskey.joincommand')}</h3>
              </Grid>

              <Grid item xs={7} style={styles.centeredText}>
                <TextField
                  fullWidth
                  maxRows={1}
                  value={getJoinCommand(Props.accessString)}
                  sx={{
                    backgroundColor: inDarkMode ? '#272727' : grey[100],
                  }}
                />
              </Grid>
              <Grid item xs={1} style={styles.centerStyle}>
                <Tooltip
                  title={`${t('common.copy')} ${t('accesskey.joincommand')}`}
                  placement="top"
                >
                  <IconButton
                    onClick={() => copy(getJoinCommand(Props.accessString))}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid item xs={3} style={styles.centerStyle}>
                <h3>{t('accesskey.dockerrun')}</h3>
              </Grid>

              <Grid item xs={7} style={styles.centeredText}>
                <TextField
                  fullWidth
                  maxRows={1}
                  value={getDockerRunCommand(Props.accessString)}
                  sx={{
                    backgroundColor: inDarkMode ? '#272727' : grey[100],
                  }}
                />
              </Grid>
              <Grid item xs={1} style={styles.centerStyle}>
                <Tooltip
                  title={`${t('common.copy')} ${t('accesskey.dockerrun')}`}
                  placement="top"
                >
                  <IconButton
                    onClick={() =>
                      copy(getDockerRunCommand(Props.accessString))
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
