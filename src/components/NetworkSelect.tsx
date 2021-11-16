import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { networkSelectors } from '../store/selectors'
import { useTranslation } from 'react-i18next'
import CustomSelect from '~components/select/CustomSelect'
import { Grid } from '@mui/material'
import { setCurrentNetwork } from '~store/modules/network/actions'

export const NetworkSelect: React.FC<{
  base: 'networks' | 'ext-clients' | 'access-keys' | 'dns'
  extension?: string
}> = ({ base, extension }) => {
  const dispatch = useDispatch()
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const networkNames = []
  if (listOfNetworks) {
    for (let i = 0; i < listOfNetworks.length; i++) {
      networkNames.push(listOfNetworks[i].netid)
    }
  }
  const { t } = useTranslation()
  const history = useHistory()

  const handleCurrentNetChange = (newCurrentNetid : string) => {
    dispatch(setCurrentNetwork(newCurrentNetid))
  }

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
            handleCurrentNetChange(selected)
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
