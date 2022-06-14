import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { networkSelectors } from '../store/selectors'
import { useTranslation } from 'react-i18next'
import CustomSelect from '~components/select/CustomSelect'
import { FormControl, Grid } from '@mui/material'

export const NetworkSelect: React.FC<{
  selectAll? : boolean
}> = ({ selectAll }) => {
  const networkNames = useSelector(networkSelectors.getNetworks).map(n => n.netid)
  const { t } = useTranslation()
  const history = useHistory()
  const { netid } = useParams<{netid?: string}>()

  if (selectAll && !!netid) {
    networkNames.push(t('common.selectall'))
  }

  return (
    <Grid container justifyContent="space-around" alignItems="center">
     <Grid item xs={12}>
      <FormControl fullWidth >
      <CustomSelect
        placeholder={`${t('common.select')} ${t('network.network')}`}
        onSelect={(selected) => {
          const netIndex = history.location.pathname.indexOf(netid!)
          if(netid === undefined) {
            history.push(`${history.location.pathname}/${selected}`)
          } else if (selectAll && selected === t('common.selectall')) {
            history.push(history.location.pathname.substr(0, netIndex - 1))
          } else if(netid !== undefined) {
            history.push(history.location.pathname.replace(netid!, selected))
          }
        }}
        items={networkNames}
      />
      </FormControl>
      </Grid>
    </Grid>

  )
}
