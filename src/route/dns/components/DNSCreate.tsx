import React, { useCallback } from 'react'
import { Grid, Modal, Typography, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch, useParams } from 'react-router'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { FormRef, NmForm, NmFormInputText } from '~components/form'
import { useNodesByNetworkId } from '~util/network'
import { DNSSelect } from './DNSSelect'
import { createDnsEntry } from '~store/modules/network/actions'
import { authSelectors, hostsSelectors } from '~store/selectors'

export const DNSEntryCreate: React.FC<{}> = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const { netid } = useParams<{ netid: string }>()
  const newPath = `${path.split(':netid')[0]}${netid}`
  const dispatch = useDispatch()
  const inDarkMode = useSelector(authSelectors.isInDarkMode)
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
  const listOfNodes = useNodesByNetworkId(netid) || []
  const nodeAddresses = listOfNodes.map(
    (node) => `${node.address} ${hostsMap[node.hostid]?.name ?? ''}`
  )

  useLinkBreadcrumb({
    title: t('common.create'),
  })

  const handleClose = () => {
    history.push(newPath)
  }

  interface CreateDNS {
    name: string
    address: string
  }

  const initialState: CreateDNS = {
    name: '',
    address: '',
  }

  const handleSubmit = useCallback(
    (data: CreateDNS) => {
      dispatch(
        createDnsEntry.request({
          ...data,
          network: netid,
        })
      )
      history.goBack()
    },
    [dispatch, netid, history]
  )

  const boxStyle = {
    modal: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      backgroundColor: inDarkMode ? '#272727' : '#f0f0f0',
      border: '1px solid #000',
      minWidth: '33%',
      // boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3,
    },
    center: {
      textAlign: 'center',
    },
    leftAlign: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    max: {
      width: '75%',
    },
  } as any

  const formRef = React.createRef<FormRef<CreateDNS>>()

  const handleSelection = (newAddress: string) => {
    const nonCidrIp = newAddress.split('/')[0]
    formRef.current?.reset(
      { ...formRef.current?.values, address: nonCidrIp },
      { keepDefaultValues: false }
    )
  }

  return (
    <Modal open={true} onClose={handleClose}>
      <Box style={boxStyle.modal}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ margin: '0.5em' }}
        >
          <Grid item xs={12} style={boxStyle.center}>
            <Typography variant="h5">{`${t('dns.create')}`}</Typography>
          </Grid>
          <Grid item xs={10} style={boxStyle.center}>
            <NmForm
              initialState={initialState}
              onSubmit={handleSubmit}
              submitProps={{
                variant: 'contained',
                fullWidth: true,
              }}
              submitText={t('common.create')}
              ref={formRef}
            >
              <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={10}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <NmFormInputText
                      name="name"
                      defaultValue={''}
                      label={String(t('dns.name'))}
                      variant="outlined"
                      margin="normal"
                      required
                      rightAlign
                      autoComplete="false"
                      autoFocus
                      style={{ width: '70%' }}
                      color="primary"
                    />
                    <Typography
                      variant="h6"
                      style={{ paddingTop: '4px', marginLeft: '8px' }}
                    >
                      {' '}
                      .{netid}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <NmFormInputText
                    name="address"
                    label={String(t('dns.address'))}
                    variant="outlined"
                    margin="normal"
                    color="primary"
                    fullWidth
                    required
                    autoComplete="false"
                  />
                </Grid>
                <Grid item xs={4}>
                  <DNSSelect
                    nodeAddrs={nodeAddresses}
                    onSelect={handleSelection}
                  />
                </Grid>
              </Grid>
            </NmForm>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
