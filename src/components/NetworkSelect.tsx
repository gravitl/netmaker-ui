import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { networkSelectors } from '../store/selectors'
import { useTranslation } from 'react-i18next'
import CustomSelect from '~components/select/CustomSelect'
import { Grid } from '@mui/material'

export const NetworkSelect: React.FC<{
  base: 'networks' | 'ext-clients' | 'access-keys' | 'dns'
  extension?: string
}> = ({ base, extension }) => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const networkNames = []
  if (listOfNetworks) {
    for (let i = 0; i < listOfNetworks.length; i++) {
      networkNames.push(listOfNetworks[i].netid)
    }
  }
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid
        item
        xs={6}
        sx={{
          textAlign: 'center',
        }}
      >
        <CustomSelect
          placeholder={`${t('common.select')} ${t('network.network')}`}
          onSelect={(selected) => {
            history.push(
              `/${base}/${selected}${extension ? `/${extension}` : ''}`
            )
          }}
          items={networkNames}
        />
      </Grid>
    </Grid>
  )
}
