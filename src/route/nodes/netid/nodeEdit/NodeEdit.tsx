import React, { useCallback, useMemo } from 'react'
import { Grid, TextField, Typography, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateNode } from '~modules/node/actions'
import {
  NmForm,
  NmFormInputSwitch,
  NmFormInputText,
  validate,
} from '~components/form'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNodeById } from '~util/node'
import { useNetwork } from '~util/network'
import { hostsSelectors } from '~store/selectors'
import { Node, nodeACLValues } from '~store/modules/node/types'
import { datePickerConverter } from '~util/unixTime'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'
import {
  correctIpv6CidrRegex,
  ipv4AddressRegex,
} from '~util/regex'
import { NmFormOptionSelect } from '~components/form/FormOptionSelect'
import { toast } from 'react-toastify'
import { defaultToastOptions } from '~store/modules/toast/saga'

export const NodeEdit: React.FC<{
  onCancel: () => void
}> = ({ onCancel }) => {
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // const serverConfig = useSelector(serverSelectors.getServerConfig)
  const { netid, nodeId } = useParams<{ nodeId: string; netid: string }>()
  const node = useNodeById(decodeURIComponent(nodeId))
  const network = useNetwork(netid)
  const hostsMap = useSelector(hostsSelectors.getHostsMap)

  const createIPValidation = useMemo(
    () =>
      validate<Node>({
        address: (address, formData) => {
          if (!formData.address) {
            return undefined
          }
          return !ipv4AddressRegex.test(address)
            ? {
                message: t('network.validation.ipv4'),
                type: 'value',
              }
            : undefined
        },
        address6: (address6, formData) => {
          if (!formData.address6) {
            return undefined
          }
          return !correctIpv6CidrRegex.test(address6)
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
    title: decodeURIComponent(t('common.edit')),
  })

  const [expTime, setExpTime] = React.useState(0)

  const rowMargin = {
    margin: '1em 0 1em 0',
  }

  const onSubmit = useCallback(
    (data: Node) => {
      if (data.pendingdelete) {
        toast.warn(
          t('toast.warnings.cannoteditnodependingdelete'),
          defaultToastOptions
        )
        return
      }
      if (expTime && expTime !== data.expdatetime) {
        data.expdatetime = expTime
      }

      dispatch(
        updateNode.request({
          token: '',
          netid: netid,
          node: { ...data },
        })
      )
    },
    [expTime, dispatch, netid, t]
  )

  if (!!!node) {
    return <div>Not Found</div>
  }

  return (
    <NmForm
      resolver={createIPValidation}
      initialState={{ ...node }}
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
              {`${t('node.details')} : ${hostsMap[node.hostid]?.name ?? ''}`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.whatisipv4'))} placement="top">
            <span>
              <NmFormInputText
                defaultValue={node.address}
                name={'address'}
                label={String(t('node.address'))}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.whatisipv6'))} placement="top">
            <span>
              <NmFormInputText
                defaultValue={node.address6}
                name={'address6'}
                label={String(t('node.address6'))}
                disabled={!network?.isipv6}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.localaddress'))} placement="top">
            <NmFormOptionSelect
              defaultValue={node.localaddress}
              label={String(t('node.localaddress'))}
              name="localaddress"
              selections={
                hostsMap[node.hostid]?.interfaces?.map((iface) => ({
                  key: `${iface.name} (${iface.addressString})`,
                  option: iface.addressString,
                })) ?? []
              }
            />
          </Tooltip>
        </Grid>
        {/* <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.nodepostup'))} placement="top">
            <span>
              <NmFormInputText
                defaultValue={node.postup}
                name={'postup'}
                label={String(t('node.postup'))}
                disabled={!serverConfig.RCE}
              />
            </span>
          </Tooltip>
        </Grid> */}
        {/* <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.nodepostdown'))} placement="top">
            <span>
              <NmFormInputText
                defaultValue={node.postdown}
                label={String(t('node.postdown'))}
                name={'postdown'}
                disabled={!serverConfig.RCE}
              />
            </span>
          </Tooltip>
        </Grid> */}
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip
            title={String(t('helper.persistentkeepalive'))}
            placement="top"
          >
            <NmFormInputText
              defaultValue={node.persistentkeepalive}
              label={String(t('node.persistentkeepalive'))}
              name={'persistentkeepalive'}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.nodeexpires'))} placement="top">
            <span>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField
                      fullWidth={false}
                      sx={{ maxWidth: '15rem' }}
                      {...props}
                    />
                  )}
                  label={String(t('node.expdatetime'))}
                  value={
                    expTime
                      ? datePickerConverter(expTime)
                      : datePickerConverter(node.expdatetime)
                  }
                  onChange={(newValue: string | null) => {
                    if (!!newValue) {
                      setExpTime(new Date(newValue).getTime() / 1000)
                    }
                  }}
                />
              </LocalizationProvider>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.lastcheckin'))} placement="top">
            <TextField
              disabled
              value={datePickerConverter(node.lastcheckin)}
              label={String(t('node.lastcheckin'))}
              name={'lastcheckin'}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.network'))} placement="top">
            <span>
              <NmFormInputText
                disabled
                defaultValue={node.network}
                label={String(t('node.network'))}
                name={'network'}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.defaultacl'))} placement="top">
            <NmFormOptionSelect
              defaultValue={
                node.defaultacl === undefined
                  ? nodeACLValues.unset
                  : node.defaultacl
                  ? nodeACLValues.allow
                  : nodeACLValues.deny
              }
              label={String(t('node.defaultacl'))}
              name={'defaultacl'}
              selections={[
                { key: nodeACLValues.unset, option: 'unset' },
                { key: nodeACLValues.allow, option: 'yes' },
                { key: nodeACLValues.deny, option: 'no' },
              ]}
            />
          </Tooltip>
        </Grid>

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={10} sm={4} md={2} sx={rowMargin}>
            <Tooltip title={String(t('helper.isdnson'))} placement="top">
              <span>
                <NmFormInputSwitch
                  label={String(t('node.dnson'))}
                  name={'dnson'}
                  defaultValue={node.dnson}
                />
              </span>
            </Tooltip>
          </Grid>
          <Grid item xs={10} sm={4} md={2} sx={rowMargin}>
            <Tooltip
              title={String(t('helper.isnodeconnected'))}
              placement="top"
            >
              <span>
                <NmFormInputSwitch
                  label={String(t('node.togglenode'))}
                  name={'connected'}
                  defaultValue={node.connected}
                />
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </NmForm>
  )
}
