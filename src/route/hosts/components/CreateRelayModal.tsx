import { useCallback, useMemo, useState } from 'react'
import {
  Modal,
  Box,
  Grid,
  useTheme,
  Autocomplete,
  TextField,
  Button,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { hostsSelectors } from '~store/selectors'
import { Host } from '~store/types'
import { createHostRelay } from '~store/modules/hosts/actions'

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

interface CreateRelayProps {
  open: boolean
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void
  hostId: Host['id']
}

export function CreateRelayModal(props: CreateRelayProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const allHosts = useSelector(hostsSelectors.getHosts)
  const [selectedHosts, setSelectedHosts] = useState<Host[]>([])

  const filteredHosts = useMemo(
    () =>
      allHosts.filter(
        (h) => h.id !== props.hostId && !(h.isrelay || h.isrelayed)
      ),
    [allHosts, props]
  )

  const createRelay = useCallback(() => {
    dispatch(
      createHostRelay.request({
        hostid: props.hostId,
        relayed_hosts: selectedHosts.map((h) => h.id),
      })
    )
    props.onClose({}, 'escapeKeyDown')
    setSelectedHosts([])
  }, [dispatch, props, selectedHosts])

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
            <Typography variant="h5">Create Relay</Typography>
          </Grid>

          <Grid item xs={10} sx={{ marginBottom: '2rem' }}>
            <Autocomplete
              multiple
              options={filteredHosts}
              getOptionLabel={(host) => host.name}
              value={selectedHosts}
              onChange={(e, selectedHosts) => setSelectedHosts(selectedHosts)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="hostIds"
                  label={String(t('hosts.hoststorelay'))}
                  variant="standard"
                  placeholder="Hosts"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button variant="contained" onClick={createRelay}>
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
