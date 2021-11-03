import { Grid } from '@mui/material'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { NmForm, NmFormInputSwitch, NmFormInputText } from '~components/form'
import { updateNetwork } from '~modules/network/actions'
import { Network } from '~modules/network/types'
import { networkToNetworkPayload } from '~modules/network/utils'

export const NetworkEdit: React.FC<{
  network: Network
  onCancel: () => void
}> = ({ network, onCancel }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

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

  if (!network) {
    return <div>Not Found</div>
  }

  return (
    <NmForm
      initialState={network}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitProps={{
        variant: 'outlined',
      }}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
    >
      <Grid container justifyContent="flex-end" alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'addressrange'}
            label={t('network.addressrange')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'addressrange6'}
            label={t('network.addressrange6')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'localrange'}
            label={t('network.localrange')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'displayname'}
            label={t('network.displayname')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultinterface'}
            label={t('network.defaultinterface')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultlistenport'}
            label={t('network.defaultlistenport')}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultpostup'}
            label={t('network.defaultpostup')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultpostdown'}
            label={t('network.defaultpostdown')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultkeepalive'}
            label={t('network.defaultkeepalive')}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultextclientdns'}
            label={t('network.defaultextclientdns')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputText
            name={'defaultmtu'}
            label={t('network.defaultmtu')}
            type="number"
          />
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
            label={t('network.isdualstack')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputSwitch
            name={'defaultsaveconfig'}
            label={t('network.defaultsaveconfig')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <NmFormInputSwitch
            name={'defaultudpholepunch'}
            label={t('network.defaultudpholepunch')}
          />
        </Grid>
      </Grid>
    </NmForm>
  )
}
