import { FC, useCallback, useMemo } from 'react'
import { Grid, Typography, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  NmForm,
  NmFormInputSwitch,
  NmFormInputText,
  validate,
} from '~components/form'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { Host } from '~store/types'
import { useGetHostById } from '~util/hosts'
import { updateHost } from '~store/modules/hosts/actions'
import { NmFormOptionSelect } from '~components/form/FormOptionSelect'

export const HostEditPage: FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { hostId } = useParams<{ hostId: string }>()
  const host = useGetHostById(decodeURIComponent(hostId))

  const rowMargin = {
    margin: '1em 0 1em 0',
  }
  useLinkBreadcrumb({
    link: url,
    title: decodeURIComponent(t('common.edit')),
  })

  const hostFormValidator = useMemo(
    () =>
      validate<Host>({
        name: (value, formData) => {
          const nameRegex = /^[a-zA-Z0-9-]+$/
          const message = t('error.name')

          if (!nameRegex.test(value)) return { message, type: 'value' }
          return undefined
        },
        verbosity: (value, formData) => {
          const message = t('error.verbositymustbeinrange')
          if (value > 4 || value < 0) {
            return { message, type: 'value' }
          }
          return undefined
        },
        listenport: (value, formData) => {
          const message = t('error.portmustbeinrange')
          if (value < 0) {
            return { message, type: 'value' }
          }
          return undefined
        },
        proxy_listen_port: (value, formData) => {
          const message = t('error.portmustbeinrange')
          if (value < 0) {
            return { message, type: 'value' }
          }
          return undefined
        },
      }),
    [t]
  )

  const onSubmit = useCallback(
    (data: Host) => {
      dispatch(updateHost.request(data))
    },
    [dispatch]
  )

  if (!host) {
    return <div>Host Not Found</div>
  }

  return (
    <NmForm
      resolver={hostFormValidator}
      initialState={{ ...host }}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitProps={{
        variant: 'contained',
        fullWidth: true,
      }}
      sx={rowMargin}
    >
      <Grid container>
        <Grid item xs={12}>
          <div style={{ textAlign: 'center', margin: '0.5em 0 1em 0' }}>
            <Typography variant="h5">
              {`${t('hosts.details')}: ${host.name}(${host.id})`}
            </Typography>
          </div>
        </Grid>

        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('common.name'))}>
            <span>
              <NmFormInputText
                defaultValue={host.name}
                name={'name'}
                label={String(t('common.name'))}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('common.verbosity'))}>
            <span>
              <NmFormInputText
                defaultValue={host.verbosity}
                name={'verbosity'}
                label={String(t('common.verbosity'))}
                type="number"
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('common.mtu'))}>
            <span>
              <NmFormInputText
                defaultValue={host.mtu}
                name={'mtu'}
                label={String(t('common.mtu'))}
                type="number"
              />
            </span>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip
            title={
              host.isstatic
                ? String(t('common.endpointip'))
                : String(t('hosts.canonlyeditendpointofstatichost'))
            }
          >
            <span>
              <NmFormInputText
                defaultValue={host.endpointip}
                name={'endpointip'}
                label={String(t('common.endpointip'))}
                disabled={!host.isstatic}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('common.listenport'))}>
            <span>
              <NmFormInputText
                defaultValue={host.listenport}
                name={'listenport'}
                label={String(t('common.listenport'))}
                type="number"
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('common.proxylistenport'))}>
            <span>
              <NmFormInputText
                defaultValue={host.proxy_listen_port}
                name={'proxy_listen_port'}
                label={String(t('common.proxylistenport'))}
                type="number"
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('common.defaultinterface'))} placement="top">
            <NmFormOptionSelect
              defaultValue={host.defaultinterface}
              label={String(t('common.defaultinterface'))}
              name="defaultinterface"
              selections={
                [...new Set(host.interfaces.map((iface) => iface.name))].map(
                  (ifaceName) => ({
                    key: ifaceName,
                    option: ifaceName,
                  })
                ) ?? []
              }
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('common.isdefault'))}>
            <span>
              <NmFormInputSwitch
                label={String(t('common.isdefault'))}
                name={'isdefault'}
                defaultValue={host.isdefault}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('hosts.proxyenabled'))}>
            <span>
              <NmFormInputSwitch
                label={String(t('hosts.proxyenabled'))}
                name={'proxy_enabled'}
                defaultValue={host.proxy_enabled}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3} sx={rowMargin}>
          <Tooltip title={String(t('hosts.isstatic'))}>
            <span>
              <NmFormInputSwitch
                label={String(t('hosts.isstatic'))}
                name={'isstatic'}
                defaultValue={host.isstatic}
              />
            </span>
          </Tooltip>
        </Grid>
      </Grid>
    </NmForm>
  )
}
