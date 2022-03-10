import React from 'react'
import { Grid, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  FormRef,
  NmForm,
  NmFormInputSwitch,
  NmFormInputText,
} from '~components/form'
import { updateNetwork } from '~modules/network/actions'
import { Network } from '~modules/network/types'
import { networkToNetworkPayload } from '~modules/network/utils'
import { useRouteMatch } from 'react-router'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { serverSelectors } from '~store/selectors'

export const NetworkEdit: React.FC<{
  network: Network
  onCancel: () => void
}> = ({ network, onCancel }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()
  const dispatch = useDispatch()
  const serverConfig = useSelector(serverSelectors.getServerConfig)

  const formRef = React.createRef<FormRef<Network>>()

  useLinkBreadcrumb({
    link: url,
    title: t('common.edit'),
  })

  const onSubmit = useCallback(
    (data: Network) => {
      dispatch(
        updateNetwork.request({
          network: networkToNetworkPayload(data),
        })
      )
    },
    [dispatch]
  )

  if (!!!network) {
    return <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
        <Typography variant="h5">
          {`${t('error.notfound')}`}
        </Typography>
      </div>
  }

  return (
    <NmForm
      initialState={network}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitProps={{
        variant: 'contained',
        fullWidth: true,
        style: {
          width: '50%'
        }
      }}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      ref={formRef}
    >
      <Grid container justifyContent="space-around" alignItems="center">
        <Grid item xs={12}>
          <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
            <Typography variant="h5">
              {`${t('network.details')} : ${network.netid}`}
            </Typography>
          </div>
          {network.iscomms && 
            <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
              <Typography variant="h6" style={{color: '#F32013', overflowWrap: 'break-word'}}>
                {`${t('network.commswarn')}`}
              </Typography>
            </div>
          }
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'addressrange'}
            label={String(t('network.addressrange'))}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'addressrange6'}
            label={String(t('network.addressrange6'))}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'localrange'}
            label={String(t('network.localrange'))}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultinterface'}
            label={String(t('network.defaultinterface'))}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultlistenport'}
            label={String(t('network.defaultlistenport'))}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultpostup'}
            label={String(t('network.defaultpostup'))}
            disabled={!serverConfig.RCE}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultpostdown'}
            label={String(t('network.defaultpostdown'))}
            disabled={!serverConfig.RCE}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultkeepalive'}
            label={String(t('network.defaultkeepalive'))}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultextclientdns'}
            label={String(t('network.defaultextclientdns'))}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultmtu'}
            label={String(t('network.defaultmtu'))}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputSwitch
            name={'allowmanualsignup'}
            label={'Allow Node Signup Without Keys'}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputSwitch
            name={'isdualstack'}
            label={String(t('network.isdualstack'))}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputSwitch
            name={'defaultudpholepunch'}
            label={String(t('network.defaultudpholepunch'))}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputSwitch
            name={'ispointtosite'}
            label={String(t('network.ispointtosite'))}
          />
        </Grid>
      </Grid>
    </NmForm>
  )
}
