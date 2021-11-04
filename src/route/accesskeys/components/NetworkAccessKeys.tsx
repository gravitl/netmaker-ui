import React from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch, useHistory, useParams } from 'react-router-dom'
import { networkSelectors } from '../../../store/selectors'
import { useTranslation } from 'react-i18next'
import CustomSelect from '~components/select/CustomSelect'
import { Grid, Typography } from '@mui/material'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'

export const NetworkAccessKeys: React.FC = () => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const networkNames = []
  if (listOfNetworks) {
    for(let i = 0; i < listOfNetworks.length; i++) {
      networkNames.push(listOfNetworks[i].netid)
    }
  }
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const history = useHistory()
  const { netid } = useParams<{ netid: string }>()
  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

  const titleStyle = {
      textAlign: 'center'
  } as any

  return (
    <Grid container justifyContent='space-around' alignItems='center'>
        <Grid item xs={12}>
            <div style={titleStyle}>
                <Typography variant='h4'>
                    {`${t('accesskey.viewing')} ${netid}`}
                </Typography>
            </div>
            <hr />
        </Grid>
        <Grid item xs={6}>
            <div style={titleStyle}>
                <CustomSelect
                    placeholder={`${t('common.select')} ${t('network.network')}`}
                    onSelect={(selected) => {
                        history.push(
                            path.replace(':netid', selected)
                        )
                        }
                    }
                    items={networkNames}
                />
            </div>
        </Grid>
    </Grid>
  )
}
