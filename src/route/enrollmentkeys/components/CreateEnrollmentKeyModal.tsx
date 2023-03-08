import { DateTimePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import {
  Modal,
  Box,
  Grid,
  Typography,
  Autocomplete,
  TextField,
  Button,
  useTheme,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { createEnrollmentKey } from '~store/modules/enrollmentkeys/actions'
import { networkSelectors } from '~store/selectors'
import { EnrollmentKey, Network } from '~store/types'
import { datePickerConverter } from '~util/unixTime'

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

const UNIX_30_DYS = 2592000000

interface CreateEnrollmentKeyModalProps {
  open: boolean
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void
}

export function CreateEnrollmentKeyModal(props: CreateEnrollmentKeyModalProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const networks = useSelector(networkSelectors.getNetworks)

  const [type, setType] = useState<'unlimited' | 'uses' | 'time-bound'>(
    'unlimited'
  )
  const [tags, setTags] = useState<EnrollmentKey['tags']>([])
  const [numOfUses, setNumOfUses] = useState(10)
  const [expireAt, setExpireAt] = useState((Date.now() + UNIX_30_DYS) / 1000)
  const [selectedNetworks, setSelectedNetworks] = useState<Network['netid'][]>(
    []
  )

  const createEnrollmentKeyFunc = useCallback(() => {
    if (tags.length === 0) {
      const tagsInput = document.querySelector('input[name=tags]') as HTMLInputElement
      if (!!tagsInput?.value) tags.push(tagsInput.value)
    }
    dispatch(
      createEnrollmentKey.request({
        tags: tags,
        networks: selectedNetworks,
        expiration: type === 'time-bound' ? Math.round(expireAt) : 0,
        unlimited: type === 'unlimited' ? true : false,
        uses_remaining: type === 'uses' ? numOfUses : 0,
      })
    )
    props.onClose({}, 'escapeKeyDown')
    setSelectedNetworks([])
  }, [dispatch, expireAt, numOfUses, props, selectedNetworks, tags, type])

  const selectAllNetworks = useCallback(() => {
    setSelectedNetworks(networks.map((net) => net.netid))
  }, [networks])

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
              {t('enrollmentkeys.createenrollmentkey')}
            </Typography>
          </Grid>

          <Grid item xs={10} sx={{ marginBottom: '2rem' }}>
            <Autocomplete
              style={{ width: '100%' }}
              freeSolo
              multiple
              options={[] as string[]}
              value={tags}
              onChange={(e, selectedTags) => setTags(selectedTags)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ width: '100%' }}
                  name="tags"
                  label={String(t('common.tags'))}
                  variant="standard"
                  placeholder={String(t('common.tagshitentertoaadd'))}
                />
              )}
            />
          </Grid>

          <Grid item xs={10} sx={{ marginBottom: '.5rem' }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                {t('common.type')}
              </FormLabel>
              <RadioGroup
                row
                name="type"
                value={type}
                onChange={(_, val) =>
                  setType(val as 'unlimited' | 'uses' | 'time-bound')
                }
              >
                <FormControlLabel
                  label={String(t('common.unlimited'))}
                  value="unlimited"
                  control={<Radio />}
                />
                <FormControlLabel
                  label={String(t('common.limitednumofuses'))}
                  value="uses"
                  control={<Radio />}
                />
                <FormControlLabel
                  label={String(t('common.timebound'))}
                  value="time-bound"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={10} sx={{ marginBottom: '2rem' }}>
            {type === 'uses' && (
              <TextField
                size="small"
                type="number"
                inputProps={{ min: '1' }}
                value={numOfUses}
                onChange={(ev) => setNumOfUses(Number(ev.target.value))}
              />
            )}
            {type === 'time-bound' && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField
                      size="small"
                      fullWidth={false}
                      sx={{ maxWidth: '15rem' }}
                      {...props}
                    />
                  )}
                  label={String(t('common.expireat'))}
                  value={datePickerConverter(expireAt)}
                  onChange={(newValue: string | null) => {
                    if (!!newValue) {
                      setExpireAt(new Date(newValue).getTime() / 1000)
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          </Grid>

          <Grid item xs={6} sx={{ marginBottom: '2rem' }}>
            <Autocomplete
              multiple
              options={networks.map((net) => net.netid)}
              value={selectedNetworks}
              onChange={(e, selectedNets) => setSelectedNetworks(selectedNets)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="networks"
                  label={String(t('common.networks'))}
                  variant="standard"
                  placeholder={String(t('common.networks'))}
                />
              )}
            />
          </Grid>
          <Grid item xs={2} sx={{ marginBottom: '2rem' }}>
            <Button variant="outlined" onClick={selectAllNetworks}>
              {t('common.selectall')}
            </Button>
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button variant="contained" onClick={createEnrollmentKeyFunc}>
              {t('common.create')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
