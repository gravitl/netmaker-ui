import React, { useCallback } from 'react'
import { Grid, useTheme, Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FormRef, NmForm, NmFormInputText } from '~components/form'
import ChoicesSelect from './ChoicesSelect'
import { proSelectors } from '~store/selectors'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useRouteMatch, useHistory, useParams } from 'react-router-dom'
import { NetworkUser } from '~store/types'
import { updateNetworkUser } from '~store/modules/pro/actions'

export const UserGroupEdit: React.FC<{}> = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const groups = useSelector(proSelectors.userGroups)
  const { url } = useRouteMatch()
  const { netid, clientid } = useParams<{ netid: string; clientid: string }>()
  const history = useHistory()
  const currentUsers = useSelector(proSelectors.networkUsers)
  let currentClient = undefined as NetworkUser | undefined
  if (!!currentUsers && !!currentUsers[netid]) {
    currentClient = currentUsers[netid].filter(user => user.id === clientid)[0]
  }

  useLinkBreadcrumb({
    link: url,
    title: t('pro.networkusers.groups'),
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

  if (!!currentClient) {
    initialState.choices = currentClient.groups.join(',')
  }

  const onSubmit = useCallback(
    (data: Data) => {
        if (!!currentClient) {
            const newRanges = data.choices.split(',')
            for (let i = 0; i < newRanges.length; i++) {
                newRanges[i] = newRanges[i].trim()
            }
            let newClient = {...currentClient}
            newClient.groups = newRanges

            dispatch(
                updateNetworkUser.request({
                    networkName: netid,
                    networkUser: newClient,
                })
            )
            history.push(`/networkusers/${netid}`)
        }
    },
    [dispatch, history, netid, currentClient]
  )

  if (!!!currentClient) {
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
                    {`${t('common.edit')} ${currentClient.id} ${t('pro.networkusers.groups')}`}
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
                        label={String(t('pro.networkusers.groups'))}
                        sx={{ height: '100%', margin: '1em 0 1em 0' }}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <ChoicesSelect options={groups} onSelect={updateChoices} />
                </Grid>
            </Grid>
            </NmForm>
            </Box>
        </Grid>
    </Grid>
  )
}
