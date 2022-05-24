import React, { useCallback } from 'react'
import { Grid, TextField, Typography, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateNode } from '~modules/node/actions'
import { NmForm, NmFormInputSwitch, NmFormInputText } from '~components/form'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { getCommaSeparatedArray } from '~util/fields'
import { useNodeById } from '~util/node'
import { useNetwork } from '~util/network'
import { serverSelectors } from '~store/selectors'
import { Node } from '~store/modules/node/types'
import { datePickerConverter } from '~util/unixTime'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'

export const NodeEdit: React.FC<{
  onCancel: () => void
}> = ({ onCancel }) => {
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const { netid, nodeId } = useParams<{ nodeId: string; netid: string }>()
  const node = useNodeById(decodeURIComponent(nodeId))
  const network = useNetwork(netid)

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
      
      if (typeof data.relayaddrs === 'string') {
        const newRelayAddrs = getCommaSeparatedArray(String(data.relayaddrs))
        if (newRelayAddrs.length) {
          data.relayaddrs = newRelayAddrs
        }
      }
      if (typeof data.egressgatewayranges === 'string') {
        const newEgressRanges = getCommaSeparatedArray(
          String(data.egressgatewayranges)
        )
        if (newEgressRanges.length) {
          data.egressgatewayranges = newEgressRanges
        }
      }
      if (typeof data.allowedips === 'string') {
        const newAllowedIps = getCommaSeparatedArray(String(data.allowedips))
        if (newAllowedIps.length) {
          data.allowedips = newAllowedIps
        }
      }
      if (expTime && expTime !== data.expdatetime) {
        data.expdatetime = expTime
      }
      
      dispatch(
        updateNode.request({
          token: '',
          netid: netid,
          node: {...data, 
          isstatic: !data.isstatic},
        })
      )
    },
    [dispatch, netid, expTime]
  )

  if (!!!node) {
    return <div>Not Found</div>
  }
  
  const isIPDynamic = !node.isstatic
  
  return (
    <NmForm
      initialState={{...node, isstatic: !node.isstatic}}
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
              {`${t('node.details')} : ${node.name}${
                node.ispending === 'yes' ? ` (${t('common.pending')})` : ''
              }`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip
            title={
              node.isstatic
                ? String(t('node.endpointdisable'))
                : String(t('node.endpointenable'))
            }
          >
            <span>
              <NmFormInputText
                defaultValue={node.endpoint}
                name={'endpoint'}
                label={String(t('node.endpoint'))}
                disabled={isIPDynamic}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={String(t('node.isstatic'))}
            name={'isstatic'}
            defaultValue={isIPDynamic}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={String(node.listenport)}
            name={'listenport'}
            label={String(t('node.listenport'))}
            type="number"
            disabled={node.isserver || node.udpholepunch}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <Tooltip
            title={
              !network?.defaultudpholepunch ? String(t('node.udpdisabled')) : ''
            }
          >
            <span>
              <NmFormInputSwitch
                label={String(t('node.udpholepunch'))}
                name={'udpholepunch'}
                defaultValue={node.udpholepunch}
                disabled={!network?.defaultudpholepunch}
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            name={'address'}
            label={String(t('node.address'))}
            defaultValue={node.address}
            disabled={node.isserver}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.address6}
            name={'address6'}
            label={String(t('node.address6'))}
            disabled={!network?.isipv6}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.localaddress}
            name={'localaddress'}
            label={String(t('node.localaddress'))}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.name}
            name={'name'}
            label={String(t('node.name'))}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled
            defaultValue={t('node.publickey')}
            name={'publickey'}
            label={String(t('node.publickey'))}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.postup}
            name={'postup'}
            label={String(t('node.postup'))}
            disabled={!serverConfig.RCE}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.postdown}
            label={String(t('node.postdown'))}
            name={'postdown'}
            disabled={!serverConfig.RCE}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.allowedips ? node.allowedips.join(',') : ''}
            label={String(t('node.allowedips'))}
            name={'allowedips'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.persistentkeepalive}
            label={String(t('node.persistentkeepalive'))}
            name={'persistentkeepalive'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled={!node.isrelay}
            defaultValue={node.relayaddrs ? node.relayaddrs.join(',') : ''}
            label={String(t('node.relayaddrs'))}
            name={'relayaddrs'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
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
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <TextField
            disabled
            value={datePickerConverter(node.lastcheckin)}
            label={String(t('node.lastcheckin'))}
            name={'lastcheckin'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled
            defaultValue={node.macaddress}
            label={String(t('node.macaddress'))}
            name={'macaddress'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled
            defaultValue={node.network}
            label={String(t('node.network'))}
            name={'network'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled={!node.isegressgateway}
            defaultValue={
              node.egressgatewayranges ? node.egressgatewayranges.join(',') : ''
            }
            label={String(t('node.egressgatewayranges'))}
            name={'egressgatewayranges'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.localrange}
            label={String(t('node.localrange'))}
            name={'localrange'}
            disabled={!node.islocal}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled
            defaultValue={node.os}
            label={String(t('node.os'))}
            name={'os'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            type="number"
            defaultValue={String(node.mtu)}
            label={String(t('node.mtu'))}
            name={'mtu'}
          />
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={10} sm={4} md={2} sx={rowMargin}>
            <NmFormInputSwitch
              label={String(t('node.dnson'))}
              name={'dnson'}
              defaultValue={node.dnson}
            />
          </Grid>
          <Grid item xs={10} sm={4} md={2} sx={rowMargin}>
            <NmFormInputSwitch
              label={String(t('node.islocal'))}
              name={'islocal'}
              defaultValue={node.islocal}
            />
          </Grid>
          <Grid item xs={10} sm={4} md={2} sx={rowMargin}>
            <NmFormInputSwitch
              label={String(t('node.ishub'))}
              name={'ishub'}
              defaultValue={node.ishub}
              disabled={!network?.ispointtosite}
            />
          </Grid>
        </Grid>
      </Grid>
    </NmForm>
  )
}
