import React, { useCallback } from 'react'
import { Grid, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateNode } from '~modules/node/actions'
import { NmForm, NmFormInputSwitch, NmFormInputText } from '~components/form'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { decode64, getCommaSeparatedArray } from '~util/fields'
import { useNodeById } from '~util/node'
import { serverSelectors } from '~store/selectors'
import { Node } from '~store/modules/node/types'
import { datePickerConverter } from '~util/unixTime'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';


export const NodeEdit: React.FC<{
  onCancel: () => void
}> = ({ onCancel }) => {
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const { netid } = useParams<{ netid: string }>()
  const { nodeId } = useParams<{ nodeId: string }>()
  const node = useNodeById(decode64(decodeURIComponent(nodeId)))

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
      const node = {
        ...data
      }
      if(typeof data.relayaddrs === 'string') {
        const newRelayAddrs = getCommaSeparatedArray(String(data.relayaddrs))
        if (newRelayAddrs.length) {
          node.relayaddrs = newRelayAddrs
        }
      }
      if (typeof data.egressgatewayranges === 'string') {
        const newEgressRanges = getCommaSeparatedArray(String(data.egressgatewayranges))
        if (newEgressRanges.length) {
          node.egressgatewayranges = newEgressRanges
        }
      }
      if (typeof data.allowedips === 'string') {
        const newAllowedIps = getCommaSeparatedArray(String(data.allowedips))
        if (newAllowedIps.length) {
          node.allowedips = newAllowedIps
        }
      }
      if (expTime && expTime !== data.expdatetime) {
        node.expdatetime = expTime
      }

      dispatch(
        updateNode.request({
          token: '',
          netid: netid,
          node,
        })
      )
    },
    [dispatch, netid, expTime]
  )

  if (!node) {
    return <div>Not Found</div>
  }

  return (
    <NmForm
      initialState={node}
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
              {`${t('node.details')} : ${node.name}${node.ispending === 'yes' ? ` (${t('common.pending')})` : ''}`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            name={'address'}
            label={t('node.address')}
            defaultValue={node.address}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.address6}
            name={'address6'}
            label={t('node.address6')}
            disabled={!node.isdualstack}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.localaddress}
            name={'localaddress'}
            label={t('node.localaddress')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.name}
            name={'name'}
            label={t('node.name')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={String(node.listenport)}
            name={'listenport'}
            label={t('node.listenport')}
            type="number"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled
            defaultValue={t('node.publickey')}
            name={'publickey'}
            label={t('node.publickey')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.endpoint}
            name={'endpoint'}
            label={t('node.endpoint')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.postup}
            name={'postup'}
            label={t('node.postup')}
            disabled={!serverConfig.RCE}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.postdown}
            label={t('node.postdown')}
            name={'postdown'}
            disabled={!serverConfig.RCE}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.allowedips ? node.allowedips.join(',') : ''}
            label={t('node.allowedips')}
            name={'allowedips'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.persistentkeepalive}
            label={t('node.persistentkeepalive')}
            name={'persistentkeepalive'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled={!node.isrelay}
            defaultValue={
              node.relayaddrs ? node.relayaddrs.join(',') : ''
            }
            label={t('node.relayaddrs')}
            name={'relayaddrs'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => 
                <TextField fullWidth={false} sx={{maxWidth: '15rem'}} {...props} />
              }
              label={t('node.expdatetime')}
              value={expTime ? datePickerConverter(expTime) : datePickerConverter(node.expdatetime)}
              onChange={(newValue: string | null) => {
                if (!!newValue) {
                  setExpTime(new Date(newValue).getTime() / 1000);
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <TextField
            disabled
            value={datePickerConverter(node.lastcheckin)}
            label={t('node.lastcheckin')}
            name={'lastcheckin'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled
            defaultValue={node.macaddress}
            label={t('node.macaddress')}
            name={'macaddress'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled
            defaultValue={node.network}
            label={t('node.network')}
            name={'network'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled={!node.isegressgateway}
            defaultValue={
              node.egressgatewayranges ? node.egressgatewayranges.join(',') : ''
            }
            label={t('node.egressgatewayranges')}
            name={'egressgatewayranges'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            defaultValue={node.localrange}
            label={t('node.localrange')}
            name={'localrange'}
            disabled={!node.islocal}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            disabled
            defaultValue={node.os}
            label={t('node.os')}
            name={'os'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputText
            type="number"
            defaultValue={String(node.mtu)}
            label={t('node.mtu')}
            name={'mtu'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={t('node.saveconfig')}
            name={'saveconfig'}
            defaultValue={node.saveconfig}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={t('node.isstatic')}
            name={'isstatic'}
            defaultValue={node.isstatic}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={t('node.udpholepunch')}
            name={'udpholepunch'}
            defaultValue={node.udpholepunch}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={t('node.dnson')}
            name={'dnson'}
            defaultValue={node.dnson}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={t('node.isdualstack')}
            name={'isdualstack'}
            defaultValue={node.isdualstack}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={t('node.islocal')}
            name={'islocal'}
            defaultValue={node.islocal}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={t('node.roaming')}
            name={'roaming'}
            defaultValue={node.roaming}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
          <NmFormInputSwitch
            label={t('node.ipforwarding')}
            name={'ipforwarding'}
            defaultValue={node.ipforwarding}
          />            
        </Grid>
      </Grid>
    </NmForm>
  )
}
