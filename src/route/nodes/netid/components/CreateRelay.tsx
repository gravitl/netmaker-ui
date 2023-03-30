import React, { useCallback } from 'react'
import { Modal, Box, Grid, Typography, useTheme } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { createRelayNode } from '~modules/node/actions'
import { useNodeById } from '~util/node'
import { useNodesByNetworkId } from '~util/network'
import { FormRef, NmForm, NmFormInputText } from '~components/form'
import RelaySelect from './RelaySelect'
import { NotFound } from '~util/errorpage'
import { hostsSelectors } from '~store/selectors'

const styles = {
  centerText: {
    textAlign: 'center',
  },
  vertTabs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  mainContainer: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    display: 'flex',
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    backgroundColor: 'white',
    border: '1px solid #000',
    minWidth: '33%',
    // boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  },
} as any

export function CreateRelay() {
  const history = useHistory()
  const theme = useTheme()
  const { t } = useTranslation()
  const { netid, nodeId } = useParams<{ netid: string; nodeId: string }>()
  const { url } = useRouteMatch()
  const node = useNodeById(nodeId)
  const dispatch = useDispatch()
  const nodes = useNodesByNetworkId(netid)
  const nodeNames = []
  const hostsMap = useSelector(hostsSelectors.getHostsMap)

  useLinkBreadcrumb({
    link: url,
    title: t('breadcrumbs.createrelay'),
  })

  interface RelayData {
    ranges: string
  }

  const initialState: RelayData = {
    ranges: '',
  }

  const onSubmit = useCallback(
    (data: RelayData) => {
      const newRanges = data.ranges.split(',')
      for (let i = 0; i < newRanges.length; i++) {
        newRanges[i] = newRanges[i].trim()
      }
      dispatch(
        createRelayNode.request({
          netid: netid,
          nodeid: nodeId,
          payload: {
            ranges: newRanges,
          },
        })
      )
      history.goBack()
    },
    [dispatch, netid, nodeId, history]
  )

  if (!node || !nodes) {
    return <NotFound />
  }

  for (let i = 0; i < nodes.length; i++) {
    if (!!nodes && !!nodes.length) {
      const data = {
        name: hostsMap[nodes[i].hostid]?.name ?? '',
        address: nodes[i].address,
        address6: nodes[i].address6,
      }
      if (nodes[i].id !== node.id) {
        nodeNames.push(data)
      }
    }
  }

  const formRef = React.createRef<FormRef<RelayData>>()

  const updateRanges = (value: string) => {
    formRef.current?.reset(
      { ...formRef.current?.values, ranges: value },
      { keepDefaultValues: true }
    )
  }

  return (
    <Modal
      style={{ display: 'flex', flex: 1 }}
      open={true}
      onClose={() => {
        history.goBack()
      }}
    >
      <Box
        style={{
          ...styles.modal,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <NmForm
          initialState={initialState}
          onSubmit={onSubmit}
          submitProps={{
            fullWidth: true,
            variant: 'contained',
          }}
          submitText={t('common.create')}
          sx={{ margin: '2em 0 2em 0' }}
          ref={formRef}
        >
          <Grid
            container
            justifyContent="space-around"
            alignItems="center"
            sx={{ margin: '1em 0 1em 0' }}
          >
            <Grid
              item
              xs={12}
              sm={8}
              sx={{ textAlign: 'center', margin: '1em 0 1em 0' }}
            >
              <Typography variant="h4">
                {`${t('node.createrelay')}: ${hostsMap[node.hostid]?.name ?? ''}`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              <NmFormInputText
                multiline
                minRows={2}
                fullWidth
                disabled
                name={'ranges'}
                label={String(t('node.relayaddrs'))}
                sx={{ height: '100%', margin: '1em 0 1em 0' }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <RelaySelect names={nodeNames} onSelect={updateRanges} />
            </Grid>
          </Grid>
        </NmForm>
      </Box>
    </Modal>
  )
}
