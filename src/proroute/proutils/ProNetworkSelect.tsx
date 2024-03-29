import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { proSelectors } from '~store/selectors'
import { useTranslation } from 'react-i18next'
import ProCustomSelect from './ProCustomSelect'
import { FormControl, Grid, Typography } from '@mui/material'
import { clearCurrentMetrics } from '~store/modules/server/actions'
import { GenericError } from '~util/genericerror'

import { authSelectors } from '~store/selectors'

export const ProNetworkSelect: React.FC<{
  selectAll?: boolean
  prepend?: string
}> = ({ selectAll, prepend }) => {
  const networkNames = useSelector(proSelectors.getNetworkUserNetworks)
  const { t } = useTranslation()
  const history = useHistory()
  const { netid } = useParams<{ netid?: string }>()
  const dispatch = useDispatch()
  const user = useSelector(authSelectors.getUser)

  if (selectAll && !!netid) {
    networkNames.push(t('common.selectall'))
  }

  const titleStyle = {
    textAlign: 'center',
  } as any

  // if statement for if no network display message no networks
  if (networkNames.length === 0) {
    return <GenericError />
  }

  return (
    <Grid container justifyContent="space-around" alignItems="center">
      <Grid item xs={12}>
        <div style={titleStyle}>
          <Typography variant="h5">
            {`${t('pro.label.welcome')} ${user?.name}`}
          </Typography>
        </div>
      </Grid>
      <Grid item xs={7} justifyContent="center">
        <FormControl fullWidth>
          <ProCustomSelect
            placeholder={`${t('common.select')} ${t('network.network')}`}
            onSelect={(selected) => {
              dispatch(clearCurrentMetrics())
              const netIndex = history.location.pathname.indexOf(netid!)
              if (netid === undefined) {
                history.push(`${history.location.pathname}/${selected}`)
              } else if (selectAll && selected === t('common.selectall')) {
                history.push(history.location.pathname.substr(0, netIndex - 1))
              } else if (netid !== undefined) {
                history.push(
                  history.location.pathname.replace(netid!, selected)
                )
              }
            }}
            items={networkNames}
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}
