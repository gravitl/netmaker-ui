import React, { useCallback, useMemo } from 'react'
import { Grid, TextField, Typography, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateNode } from '~modules/node/actions'
import {
  NmForm,
  NmFormInputSwitch,
  NmFormInputText,
  validate,
} from '~components/form'
import { useLinkBreadcrumb } from '../../../components/PathBreadcrumbs'
import { getCommaSeparatedArray } from '~util/fields'
import { hostsSelectors, proSelectors, serverSelectors } from '~store/selectors'
import { Node, nodeACLValues } from '~store/modules/node/types'
import { datePickerConverter } from '~util/unixTime'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'
import {
  correctIPv4CidrRegex,
  correctIpv6CidrRegex,
  ipv4AddressRegex,
} from '~util/regex'
import { convertStringToArray } from '~util/fields'
import { NmFormOptionSelect } from '~components/form/FormOptionSelect'
import { NotFound } from '~util/errorpage'
import { Network } from '~store/types'
import { defaultToastOptions } from '~store/modules/toast/saga'
import { toast } from 'react-toastify'

export const ProNodeEdit: React.FC = () => {
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const { netid, nodeid } = useParams<{ nodeid: string; netid: string }>()
  const userData = useSelector(proSelectors.networkUserData)[netid]
  let node: Node
  let network: Network
  const hostsMap = useSelector(hostsSelectors.getHostsMap)

  if (!!userData) {
    node = userData.nodes.filter((n) => n.id === nodeid)[0]
    network = userData.networks.filter((n) => n.netid === netid)[0]
  } else {
    node = {} as Node
    network = {} as Network
  }

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
        egressgatewayranges: (egressgatewayranges, formData) => {
          if (!formData.isegressgateway) {
            return undefined
          }

          if (typeof egressgatewayranges === 'string') {
            egressgatewayranges = convertStringToArray(egressgatewayranges)
          }

          for (let i = 0; i < egressgatewayranges.length; i++) {
            const correctIPv4 = correctIPv4CidrRegex.test(
              egressgatewayranges[i]
            )
            const correctIPv6 = correctIpv6CidrRegex.test(egressgatewayranges[i])
            if (!correctIPv4 && !correctIPv6) {
              return {
                message: t('node.validation.egressgatewayrange'),
                type: 'value',
              }
            }
          }
          return undefined
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
      if (typeof data.egressgatewayranges === 'string') {
        const newEgressRanges = getCommaSeparatedArray(
          String(data.egressgatewayranges)
        )
        if (newEgressRanges.length) {
          data.egressgatewayranges = newEgressRanges
        }
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

  if (!node || !node.id || !network || !network.netid) {
    return <NotFound />
  }

  return (
    <NmForm
      resolver={createIPValidation}
      initialState={{ ...node }}
      onSubmit={onSubmit}
      onCancel={() => history.goBack()}
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
            <NmFormInputText
              defaultValue={node.localaddress}
              name={'localaddress'}
              label={String(t('node.localaddress'))}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip title={String(t('helper.publickey'))} placement="top">
            <span>
              <NmFormInputText
                disabled
                defaultValue={t('node.publickey')}
                name={'publickey'}
                label={String(t('node.publickey'))}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
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
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
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
        </Grid>
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
          <Tooltip title={String(t('helper.macaddress'))} placement="top">
            <span>
              <NmFormInputText
                disabled
                defaultValue={node.macaddress}
                label={String(t('node.macaddress'))}
                name={'macaddress'}
              />
            </span>
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
          <Tooltip title={String(t('helper.egressrange'))} placement="top">
            <span>
              <NmFormInputText
                disabled={!node.isegressgateway}
                defaultValue={
                  node.egressgatewayranges
                    ? node.egressgatewayranges.join(',')
                    : ''
                }
                label={String(t('node.egressgatewayranges'))}
                name={'egressgatewayranges'}
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
            <Tooltip title={String(t('helper.nodeislocal'))} placement="top">
              <span>
                <NmFormInputSwitch
                  label={String(t('node.islocal'))}
                  name={'islocal'}
                  defaultValue={node.islocal}
                />
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </NmForm>
  )
}
