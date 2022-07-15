import React, { useCallback } from 'react'
import { Grid, useTheme, Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNetwork } from '~util/network'
import { updateNetwork } from '~store/modules/network/actions'
import { useDispatch, useSelector } from 'react-redux'
import { networkToNetworkPayload } from '~store/modules/network/utils'
import { FormRef, NmForm, NmFormInputText } from '~components/form'
import ChoicesSelect from './ChoicesSelect'
import { proSelectors } from '~store/selectors'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { Network } from '~store/types'

export const NetworkListEdit: React.FC<{ netid: string, field: 'users' | 'groups' }> = ({
  netid,
  field,
}) => {
  const network = useNetwork(netid)
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const groups = useSelector(proSelectors.userGroups)
  const users = useSelector(proSelectors.networkUsers)[netid]
  let userNames = ['*'] as string[]
  if (!!users && !!users.length) {
    userNames = [...users.map(u => u.id), '*']
  }
  const { url } = useRouteMatch()
  const history = useHistory()

  useLinkBreadcrumb({
    link: url,
    title: `${field === 'groups' ? t('pro.network.allowedgroups') : t('pro.network.allowedusers')}`,
  })

  const updateChoices = (value: string) => {
    formRef.current?.reset(
      { ...formRef.current?.values, choices: value },
      { keepDefaultValues: true }
    )
  }

  interface Data {
    choices: string
  }

  let initialState: Data = {
    choices: '',
  }

  if (!!network && !!network.prosettings) {
      if (field === 'groups') {
        initialState.choices = network.prosettings.allowedgroups.join(',')
      } else {
        initialState.choices = network.prosettings.allowedusers.join(',')
      }
  }

  const onSubmit = useCallback(
    (data: Data) => {
        if (!!network && !!network.prosettings) {
            const newRanges = data.choices.split(',')
            for (let i = 0; i < newRanges.length; i++) {
                newRanges[i] = newRanges[i].trim()
            }
            let netCopy = {...network} as Network
            if (field === 'groups') {
                netCopy.prosettings = {
                    ...network.prosettings,
                    allowedgroups: newRanges
                } 
            } else {
                netCopy.prosettings = {
                    ...network.prosettings,
                    allowedusers: newRanges
                } 
            }
            const newNet = networkToNetworkPayload(netCopy)
            
            dispatch(
                updateNetwork.request({
                    network: newNet
                })
            )
            history.push(`/networks/${netid}`)
        }
    },
    [dispatch, history, network, field, netid]
  )

  if (!!!network || !!!network.prosettings) {
    return (
        <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
          <Typography variant="h5">{`${t('error.notfound')}`}</Typography>
        </div>
      )
  }

  const formRef = React.createRef<FormRef<Data>>()

  return (
    <Grid
        container
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        style={{ marginBottom: '2em' }}
        >
        <Grid item xs={12}>
            <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
                <Typography variant="h5">
                    {`${t('common.edit')} ${network.netid} ${field === 'groups' ? t('pro.network.allowedgroups') : t('pro.network.allowedusers')}`}
                </Typography>
            </div>
        </Grid>
        <Grid item xs={12} md={10}>
            <Box style={{backgroundColor: theme.palette.background.paper}}>
                <NmForm
                initialState={initialState}
                onSubmit={onSubmit}
                submitProps={{
                    fullWidth: true,
                    variant: 'contained',
                }}
                submitText={t('common.submit')}
                sx={{ margin: '2em 0 2em 0' }}
                ref={formRef}
                >
            <Grid
                container
                justifyContent="space-around"
                alignItems="center"
                sx={{ margin: '1em 0 1em 0' }}
            >
                <Grid item xs={12} sm={5}>
                    <NmFormInputText
                        multiline
                        minRows={2}
                        fullWidth
                        disabled
                        name={'choices'}
                        label={String(t(`${field === 'groups' ? 'pro.network.allowedgroups' : 'pro.network.allowedusers'}`))}
                        sx={{ height: '100%', margin: '1em 0 1em 0' }}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <ChoicesSelect options={field === 'groups' ? groups : userNames} onSelect={updateChoices} />
                </Grid>
            </Grid>
            </NmForm>
            </Box>
        </Grid>
    </Grid>
  )
}
