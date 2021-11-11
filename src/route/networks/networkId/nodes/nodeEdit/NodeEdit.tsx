import {
    Button,
    Grid,
    TextField,
    Switch as SwitchField,
    FormControlLabel,
  } from '@mui/material'
  import { useTranslation } from 'react-i18next'
  import {
    useRouteMatch,
    useHistory,
    useParams,
    Switch,
    Route,
  } from 'react-router-dom'
import { NmFormInputText } from '~components/form'
  import { NmLink } from '~components/index'
  import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
  import { decode64 } from '~util/fields'
  import { useNodeById } from '~util/node'
  import { datePickerConverter } from '~util/unixTime'
  
  export const NodeEdit: React.FC = () => {
    const { path, url } = useRouteMatch()
    const history = useHistory()
    const { t } = useTranslation()
  
    const { nodeId } = useParams<{ nodeId: string }>()
    const node = useNodeById(decode64(decodeURIComponent(nodeId)))
  
    useLinkBreadcrumb({
      link: url,
      title: decodeURIComponent(nodeId),
    })
  
    if (!node) {
      return <div>Not Found</div>
    }
  
    const rowMargin = {
      margin: '1em 0 1em 0'
    }
  
    return (
      <Switch>
        <Route path={`${path}/edit`}>
          {/* <NodeEdit node={node} /> */}
          <Button
            variant="outlined"
            onClick={() => {
              history.push(
                url
                  .replace(':networkId', node.network)
                  .replace(':nodeId', node.id)
                  .replace('/edit', '')
              )
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => console.log('removeNetwork(networkData.netid)')}
          >
            {t('common.delete')}
          </Button>
        </Route>
        <Route exact path={path}>
          <Grid
            container
            // sx={{
            //   '& .MuiTextField-root': { m: 1, width: '25ch' },
            // }}
          >
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
              <NmFormInputText placeholder={node.address} name={t('node.address')} label={t('node.address')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              value={node.address6}
              label={t('node.address6')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              value={node.localaddress}
              label={t('node.localaddress')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.name} label={t('node.name')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.listenport}
              label={t('node.listenport')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.publickey}
              label={t('node.publickey')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.endpoint}
              label={t('node.endpoint')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.postup} label={t('node.postup')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.postdown}
              label={t('node.postdown')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.allowedips ? node.allowedips.join(',') : ''}
              label={t('node.allowedips')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.persistentkeepalive}
              label={t('node.persistentkeepalive')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.accesskey}
              label={t('node.accesskey')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.interface}
              label={t('node.interface')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.lastmodified)}
              label={t('node.lastmodified')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.keyupdatetimestamp)}
              label={t('node.keyupdatetimestamp')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.expdatetime)}
              label={t('node.expdatetime')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.lastpeerupdate)}
              label={t('node.lastpeerupdate')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={datePickerConverter(node.lastcheckin)}
              label={t('node.lastcheckin')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.macaddress}
              label={t('node.macaddress')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.network} label={t('node.network')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.egressgatewayranges ? node.egressgatewayranges.join(',') : ''}
              label={t('node.egressgatewayranges')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField
              disabled
              value={node.localrange}
              label={t('node.localrange')}
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.os} label={t('node.os')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <TextField disabled value={node.mtu} label={t('node.mtu')} />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.saveconfig')}
              control={<SwitchField checked={node.saveconfig} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.isstatic')}
              control={<SwitchField checked={node.isstatic} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.udpholepunch')}
              control={<SwitchField checked={node.udpholepunch} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.dnson')}
              control={<SwitchField checked={node.dnson} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.isdualstack')}
              control={<SwitchField checked={node.isdualstack} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.isserver')}
              control={<SwitchField checked={node.isserver} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.islocal')}
              control={<SwitchField checked={node.islocal} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.roaming')}
              control={<SwitchField checked={node.roaming} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
            <FormControlLabel
              label={t('node.ipforwarding')}
              control={<SwitchField checked={node.ipforwarding} disabled />}
              disabled
            />
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
              <NmLink to={`${url}/edit`} variant="outlined">
              {t('common.edit')}
              </NmLink>
            </Grid>
            <Grid item xs={6} sm={4} md={3} sx={rowMargin}>
              <Button variant='outlined'>
              {t('common.delete')}
              </Button>
            </Grid>
          </Grid>
        </Route>
      </Switch>
    )
  }
  