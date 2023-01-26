import React from 'react'
import { Grid, Tooltip, Typography } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  FormRef,
  NmForm,
  NmFormInputSwitch,
  NmFormInputText,
  validate,
} from '~components/form'
import { updateNetwork } from '~modules/network/actions'
import { Network } from '~modules/network/types'
import { networkToNetworkPayload } from '~modules/network/utils'
import { useRouteMatch } from 'react-router'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { serverSelectors } from '~store/selectors'
import { correctIPv4CidrRegex, correctIpv6CidrRegex } from '~util/regex'
import { NotFound } from '~util/errorpage'
import { NmLink } from '~components/Link'

export const ProNetworkEdit: React.FC<{
  network: Network
  onCancel: () => void
}> = ({ network, onCancel }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()
  const dispatch = useDispatch()
  const serverConfig = useSelector(serverSelectors.getServerConfig)

  const formRef = React.createRef<FormRef<Network>>()

  const createipValidation = useMemo(
    () =>
      validate<Network>({
        addressrange: (addressrange, formData) => {
          if (!formData.isipv4) {
            return undefined
          }
          return !correctIPv4CidrRegex.test(addressrange)
            ? {
                message: t('network.validation.ipv4'),
                type: 'value',
              }
            : undefined
        },
        addressrange6: (addressrange6, formData) => {
          if (!formData.isipv6) {
            return undefined
          }
          return !correctIpv6CidrRegex.test(addressrange6)
            ? {
                message: t('network.validation.ipv6'),
                type: 'value',
              }
            : undefined
        },
      }),
    [t]
  )

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
    return <NotFound />
  }

  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as any

  return (
    <NmForm
      resolver={createipValidation}
      initialState={network}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitProps={{
        variant: 'contained',
        fullWidth: true,
        style: {
          width: '50%',
        },
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
        </Grid>
        <Tooltip title={t('helper.whatisipv4') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'addressrange'}
              label={String(t('network.addressrange'))}
              disabled={!network.isipv4}
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.whatisipv6') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'addressrange6'}
              label={String(t('network.addressrange6'))}
              disabled={!network.isipv6}
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.localrange') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'localrange'}
              label={String(t('network.localrange'))}
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.defaultinterface') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'defaultinterface'}
              label={String(t('network.defaultinterface'))}
            />
          </Grid>
        </Tooltip>
        <Tooltip
          title={t('helper.defaultlistenport') as string}
          placement="top"
        >
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'defaultlistenport'}
              label={String(t('network.defaultlistenport'))}
              type="number"
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.defaultpostup') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'defaultpostup'}
              label={String(t('network.defaultpostup'))}
              disabled={!serverConfig.RCE}
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.defaultpostdown') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'defaultpostdown'}
              label={String(t('network.defaultpostdown'))}
              disabled={!serverConfig.RCE}
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.keepalive') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'defaultkeepalive'}
              label={String(t('network.defaultkeepalive'))}
              type="number"
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.extclient') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'defaultextclientdns'}
              label={String(t('network.defaultextclientdns'))}
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.mtu') as string} placement="top">
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputText
              name={'defaultmtu'}
              label={String(t('network.defaultmtu'))}
              type="number"
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.ipv4') as string} placement="top">
          <Grid item xs={12} sm={6} md={3}>
            <div style={centerStyle}>
              <NmFormInputSwitch
                name={'isipv4'}
                label={String(t('network.isipv4'))}
                disabled
              />
            </div>
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.ipv6') as string} placement="top">
          <Grid item xs={12} sm={6} md={3}>
            <div style={centerStyle}>
              <NmFormInputSwitch
                name={'isipv6'}
                label={String(t('network.isipv6'))}
                disabled
              />
            </div>
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.nokeysignup') as string}>
          <Grid item xs={12} sm={4} md={3}>
            <NmFormInputSwitch
              name={'allowmanualsignup'}
              label={'Allow Node Signup Without Keys'}
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.udpholepunching') as string}>
          <Grid item xs={12} sm={4} md={2}>
            <NmFormInputSwitch
              name={'defaultudpholepunch'}
              label={String(t('network.defaultudpholepunch'))}
            />
          </Grid>
        </Tooltip>
        <Tooltip title={t('helper.defaultaccesscontrol') as string}>
          <Grid item xs={12} sm={6} md={3}>
            <NmFormInputSwitch
              name={'defaultacl'}
              label={String(t('network.defaultacl'))}
            />
          </Grid>
        </Tooltip>
        {serverConfig.IsEE && <>
        <Grid item xs={12} style={{ marginTop: '1rem' }}></Grid>
        <Grid item xs={12} sm={4} md={3.1}>
          <Tooltip
            title={t('pro.helpers.accesslevel') as string}
            placement="top"
          >
            <NmFormInputText
              name="prosettings.defaultaccesslevel"
              label={String(t('pro.network.defaultaccesslevel'))}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 3 } }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4} md={3.1}>
          <Tooltip
            title={t('pro.helpers.usernodelimit') as string}
            placement="top"
          >
            <NmFormInputText
              name="prosettings.defaultusernodelimit"
              label={String(t('pro.network.defaultusernodelimit'))}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4} md={3.1}>
          <Tooltip
            title={t('pro.helpers.userclientlimit') as string}
            placement="top"
          >
            <NmFormInputText
              name="prosettings.defaultuserclientlimit"
              label={String(t('pro.network.defaultuserclientlimit'))}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '1rem' }}></Grid>
        <Grid item xs={6} sm={5.75} md={5.5}>
          <Grid container justifyContent={'space-evenly'}>
            <Grid item xs={12} md={8} style={centerStyle}>
              <NmFormInputText
                fullWidth
                name="prosettings.allowedgroups"
                label={String(t('pro.network.allowedgroups'))}
                disabled
              />
            </Grid>
            <Grid item xs={8} md={4} style={centerStyle}>
              <NmLink
                sx={{ textTransform: 'none' }}
                to={`/networks/${network.netid}/edit/groups`}
                fullWidth
                variant="outlined"
              >
                {`${t('common.edit')} ${t('pro.network.allowedgroups')}`}
              </NmLink>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} sm={5.75} md={5.5}>
          <Grid container>
            <Grid item xs={12} md={8} style={centerStyle}>
              <NmFormInputText
                fullWidth
                name="prosettings.allowedusers"
                label={String(t('pro.network.allowedusers'))}
                disabled
              />
            </Grid>
            <Grid item xs={8} md={4} style={centerStyle}>
              <NmLink
                variant="outlined"
                fullWidth
                sx={{ textTransform: 'none' }}
                to={`/networks/${network.netid}/edit/networkusers`}
              >
                {`${t('common.edit')} ${t('pro.network.allowedusers')}`}
              </NmLink>
            </Grid>
          </Grid>
        </Grid>
        </>
        }
      </Grid>
    </NmForm>
  )
}
