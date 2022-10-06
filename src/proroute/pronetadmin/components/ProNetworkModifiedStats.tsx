import { Grid, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { datePickerConverter } from '~util/unixTime'
import { useNetwork } from '~util/network'

export const ProNetworkModifiedStats: React.FC<{ netid: string }> = ({
  netid,
}) => {
  const network = useNetwork(netid)
  const { t } = useTranslation()

  const fieldStyle = {
    marginTop: '1em',
  }

  if (!network) {
    return null
  }
  return (
    <Grid
      container
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      style={{ marginBottom: '2em' }}
    >
      <Grid item xs={12} md={6}>
        <TextField
          label={String(t('network.nodeslastmodified'))}
          type="datetime-local"
          disabled
          style={fieldStyle}
          value={datePickerConverter(network.nodeslastmodified)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          label={String(t('network.networklastmodified'))}
          type="datetime-local"
          disabled
          style={fieldStyle}
          value={datePickerConverter(network.networklastmodified)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </Grid>
  )
}
