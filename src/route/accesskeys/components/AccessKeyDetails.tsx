import * as React from 'react'
import Box from '@mui/material/Box'
import { Grid, IconButton, TextField, Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { useTranslation } from 'react-i18next'
import { ContentCopy } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { serverSelectors } from '~store/types'
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
  const version = useSelector(serverSelectors.getServerConfig).Version || 'latest'

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
    return `curl -sfL https://raw.githubusercontent.com/gravitl/netmaker/master/scripts/netclient-install.sh | VERSION=v${version} KEY=${accessToken} sh -`
  }

  const getDockerRunCommand = (accessToken: string) => {
    return `docker run -d --network host  --privileged -e TOKEN=${accessToken} -v /etc/netclient:/etc/netclient --name netclient gravitl/netclient:v${version}`
  }

  const getWindowsRunCommand = (accessToken: string) => {
    return `. { iwr -useb  https://raw.githubusercontent.com/gravitl/netmaker/master/scripts/netclient-install.ps1 } | iex; Netclient-Install -version "v${version}" -token "${accessToken}"`
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
              <Typography id="modal-modal-title" variant="h5" style={{marginBottom: '0.5em'}}>
                {Props.title}
              </Typography>
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
              <Grid item xs={12} style={styles.centerStyle}>
                <Typography id="modal-modal-title" variant="h6" style={{marginBottom: '0.5em', marginTop: '0.5em'}}>
                  {t('accesskey.clientinstall')}
                </Typography>
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
              <Grid item xs={3} style={styles.centerStyle}>
                <h3>{t('accesskey.dockerrun')}</h3>
              </Grid>
              <Grid item xs={7} style={styles.centeredText}>
                <TextField
                  fullWidth
                  maxRows={1}
                  value={getDockerRunCommand(Props.accessString)}
                  sx={{ backgroundColor: grey[100] }}
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
              <Grid item xs={3} style={styles.centerStyle}>
              <h3>{t('accesskey.windows')}</h3>
              </Grid>
              <Grid item xs={7} style={styles.centeredText}>
                <TextField
                  fullWidth
                  maxRows={1}
                  value={getWindowsRunCommand(Props.accessString)}
                  sx={{ backgroundColor: grey[100] }}
                />
              </Grid>
              <Grid item xs={1} style={styles.centerStyle}>
                <Tooltip
                  title={`${t('common.copy')} ${t('accesskey.windows')}`}
                  placement="top"
                >
                  <IconButton
                    onClick={() =>
                      copy(getWindowsRunCommand(Props.accessString))
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
