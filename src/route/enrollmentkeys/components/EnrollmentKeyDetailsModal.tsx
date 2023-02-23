import { Modal, Box, Grid, Typography, TextField } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { NetworkTable } from '../../networks/components/NetworkTable'
import { EnrollmentKey, networkSelectors } from '~store/types'

interface EnrollmentKeyDetailsModalProps {
  enrollmentKey: EnrollmentKey
  open: boolean
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void
}

const styles = {
  centerText: {
    textAlign: 'center',
  },
  vertTabs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  mainContainer: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    display: 'flex',
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    backgroundColor: 'white',
    border: '1px solid #000',
    minWidth: '33%',
    // boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  },
} as any

export function EnrollmentKeyDetailsModal(
  props: EnrollmentKeyDetailsModalProps
) {
  const { t } = useTranslation()
  const theme = useTheme()
  const networks = useSelector(networkSelectors.getNetworks)

  const assocNetworks = useMemo(
    () =>
      networks.filter((net) =>
        props.enrollmentKey.networks.includes(net.netid)
      ),
    [networks, props.enrollmentKey.networks]
  )

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        style={{
          ...styles.modal,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          sx={{ padding: '2em' }}
        >
          <Grid item xs={12} textAlign="center" sx={{ marginBottom: '2rem' }}>
            <Typography variant="h5">
              {t('common.enrollmentkey')}: {props.enrollmentKey.value}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
            <TextField
              disabled
              style={{ width: '100%' }}
              value={props.enrollmentKey.tags.reduce(
                (acc, tag) => `${acc}${tag} `,
                ''
              )}
              label={String(t('common.tags'))}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
            <TextField
              style={{ width: '100%' }}
              disabled
              value={props.enrollmentKey.token}
              label={String(t('enrollmentkeys.token'))}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
            <TextField
              style={{ width: '100%' }}
              disabled
              value={String(props.enrollmentKey.unlimited)}
              label={String(t('enrollmentkeys.isunlimited'))}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
            <TextField
              style={{ width: '100%' }}
              disabled
              value={String(props.enrollmentKey.uses_remaining)}
              label={String(t('enrollmentkeys.usesRemaining'))}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
            <TextField
              style={{ width: '100%' }}
              disabled
              value={new Date(props.enrollmentKey.expiration).toLocaleString()}
              label={String(t('enrollmentkeys.expiration'))}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
            <NetworkTable networks={assocNetworks} />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
