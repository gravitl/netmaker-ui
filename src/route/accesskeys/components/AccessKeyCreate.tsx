import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch, useParams  } from 'react-router-dom'
import { networkSelectors } from '../../../store/selectors'
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'
import { NmForm, NmFormInputText } from '~components/form'
import { createAccessKey, clearMetadata } from '../../../store/modules/network/actions'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNetwork } from '~util/network'
import AccessKeyDetails from './AccessKeyDetails'

export const AccessKeyCreate: React.FC = () => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const networkNames = []
  if (listOfNetworks) {
    for(let i = 0; i < listOfNetworks.length; i++) {
      networkNames.push(listOfNetworks[i].netid)
    }
  }
  const { netid } = useParams<{ netid: string }>()
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const network = useNetwork(netid)
  const [ modalOpen, setModalOpen ] = React.useState(false)

  useLinkBreadcrumb({
    title: t('common.create')
  })
  useLinkBreadcrumb({
      link: url.replace('/create', ''),
      title: netid
  })

  const handleOpen = () => setModalOpen(true)

  const handleClose = useCallback(
    () => {
      dispatch(
        clearMetadata.request({
          netid
        })
      )
      setModalOpen(false)
    },
    [dispatch, netid]
  )

  if (network?.metadata && !modalOpen) {
    handleOpen()
  }

  const centerStyle = {
    textAlign: 'center',
    marginBottom: '1em'
  } as any

  interface CreateAccessKey {
        name: string
        uses: number
  }

  const initialState: CreateAccessKey = {
        name: '',
        uses: 0
  }

  const onSubmit = useCallback(
    (data: CreateAccessKey) => {
      dispatch(
        createAccessKey.request({
          netid,
          newAccessKey: {
              ...data
          }
        })
      )
    },
    [dispatch, netid]
  )
  
  return (
    <Grid container justifyContent='center' alignItems='center'>
        {network?.metadata && <AccessKeyDetails 
          title={t('accesskey.details')}
          keyValue={network.metadata.value as string}
          accessString={network.metadata.accessString as string}
          open={modalOpen}
          handleClose={handleClose}
          handleOpen={handleOpen}
        />}
        <Grid item xs={10} style={centerStyle}>
            <Typography variant='h4'>
                {t('accesskey.create')}
            </Typography>
            <hr/>
        </Grid>
        <Grid item xs={10} style={centerStyle}>
            <Typography variant='h6'>
                {`${t('network.network')}: ${netid}`}
            </Typography>
        </Grid>
        <Grid item xs={10} style={centerStyle}>
            <NmForm
                initialState={initialState}
                onSubmit={onSubmit}
                submitProps={{
                    variant: 'contained',
                    fullWidth: true,
                }}
                submitText={t('common.create')}
            >
                <Grid container justifyContent='center' alignItems='center'>
                <Grid item xs={12} md={6}>
                    <NmFormInputText name={'name'} label={t('accesskey.name')} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <NmFormInputText name={'uses'} label={t('accesskey.uses')} type='number'/>
                </Grid>
                </Grid>
            </NmForm>
        </Grid>
    </Grid>
  )
}
