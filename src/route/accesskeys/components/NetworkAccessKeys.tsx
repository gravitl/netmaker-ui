import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch, useHistory, useParams } from 'react-router-dom'
import { networkSelectors } from '../../../store/selectors'
import { useTranslation } from 'react-i18next'
import CustomSelect from '~components/select/CustomSelect'
import { Button, Grid, Typography } from '@mui/material'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
// import { deleteAccessKey, getAccessKeys } from '../../../store/modules/network/actions'
import { useNetwork } from '~util/network'
import { NmLink } from '~components/Link'

export const NetworkAccessKeys: React.FC = () => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  // const dispatch = useDispatch()
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
  const network = useNetwork(netid)

  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

  const titleStyle = {
      textAlign: 'center'
  } as any

  const centerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
        <Grid item xs={10}>
            <div style={titleStyle}>
            {network && network?.accesskeys ?
                <Grid container justifyContent='center' alignItems='center'>
                        <Grid item xs={5}>
                            {t('common.name')}
                        </Grid>
                        <Grid item xs={5}>
                            {t('accesskey.usesremaining')}
                        </Grid>
                    {network?.accesskeys.map(accesskey => <div key={accesskey.name}>
                        <Grid item xs={5}>
                            {accesskey.name}
                        </Grid>
                        <Grid item xs={5}>
                            {accesskey.uses}
                        </Grid>
                    </div>)}
                </Grid>
                :
                <Typography variant='h6'>
                    {t('accesskey.none')}
                </Typography>
            }
            </div> 
        </Grid>
        <Grid item xs={6}>
            <div style={centerStyle}>
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
                <NmLink variant='contained' to={netid ? `/access-keys/create/${netid}` : '/access-keys/create'}>
                    {`${t('common.create')} ${t('accesskey.accesskey')}`}
                </NmLink>
            </div>
        </Grid>
    </Grid>
  )
}
