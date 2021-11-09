import React from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { networkSelectors } from '../../../store/selectors'
import { useTranslation } from 'react-i18next'
import CustomSelect from '~components/select/CustomSelect'
import { Grid } from '@mui/material'

export const AccessKeySelect: React.FC = () => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const networkNames = []
  if (listOfNetworks) {
    for(let i = 0; i < listOfNetworks.length; i++) {
      networkNames.push(listOfNetworks[i].netid)
    }
  }
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Grid container justifyContent='center' alignItems='center'>
      <Grid item xs={6} sx={
        {
          textAlign: 'center'
        }
      }>
        <CustomSelect
          placeholder={`${t('common.select')} ${t('network.network')}`}
          onSelect={(selected) => {
              history.push(
                `${path}/${selected}`
              )
            }
          }
          items={networkNames}
        />
      </Grid>
    </Grid>
  )
}
