import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Button, Grid } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import {
  FormRef,
  NmForm,
  NmFormInputSwitch,
  NmFormInputText,
} from '../../../components/form'
import { useLinkBreadcrumb } from '../../../components/PathBreadcrumbs'
import { createNetwork } from '../../../store/modules/network/actions'
import { randomNetworkName, randomCIDR } from '~util/fields'

interface CreateNetwork {
  addressrange: string
  netid: string
  localrange: string
  islocal: boolean
  isdualstack: boolean
  addressrange6: string
  defaultudpholepunch: boolean
}

const initialState: CreateNetwork = {
  addressrange: '',
  netid: '',
  localrange: '',
  islocal: false,
  isdualstack: false,
  addressrange6: '',
  defaultudpholepunch: false,
}

const useStyles = makeStyles(() => createStyles({
  center: {
    textAlign: 'center'
  },
  rowMargin: {
    marginTop: '1em',
    marginBottom: '1em',
  },
}))

export const NetworkCreate: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const classes = useStyles()

  const onSubmit = useCallback(
    (data: CreateNetwork) => {
      dispatch(
        createNetwork.request({
          ...data,
          islocal: data.islocal ? 'yes' : 'no',
          isdualstack: data.isdualstack ? 'yes' : 'no',
          defaultudpholepunch: data.defaultudpholepunch ? 'yes' : 'no',
        })
      )
    },
    [dispatch]
  )

  const formRef = React.createRef<FormRef<CreateNetwork>>()

  useLinkBreadcrumb({
    title: t('common.create'),
  })

  return (
    <NmForm
      initialState={initialState}
      onSubmit={onSubmit}
      submitProps={{
        variant: 'outlined',
        fullWidth: true,
      }}
      submitText={t('network.create')}
      ref={formRef}
    >
      <Grid container justifyContent='space-around' alignItems='center'>
        <Grid item xs={12} sm={12} md={4} className={classes.rowMargin}>
          <NmFormInputText fullWidth name={'netid'} label={t('network.netid')} />
        </Grid>
        <Grid item xs={12} sm={12} md={4} className={classes.rowMargin}>
          <NmFormInputText
            fullWidth
            name={'addressrange'}
            label={t('network.addressrange')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2} className={classes.rowMargin}>
          <Button onClick={() => {
              console.log("Prefill Button Press ", formRef.current)
              formRef.current?.reset({...formRef.current?.values, netid: randomNetworkName(), addressrange: randomCIDR()}, { keepDefaultValues: true})
            }}
              variant='contained'
            >
              {t('common.autofill')}
          </Button>
        </Grid>
        <Grid item xs={12} className={classes.center + ' ' + classes.rowMargin}>
          <NmFormInputSwitch
            name={'defaultudpholepunch'}
            label={t('network.defaultudpholepunch')}
          /> 
        </Grid>
        <Grid item xs={12} sm={12} md={5} className={classes.rowMargin}>
          <NmFormInputSwitch name={'islocal'} label={t('network.islocal')} />
        </Grid>
        <Grid item xs={12} sm={12} md={5} className={classes.rowMargin}>
          <NmFormInputText fullWidth name={'localrange'} label={t('network.localrange')} />
        </Grid>
        <Grid item xs={12} sm={12} md={5} className={classes.rowMargin}>
          <NmFormInputSwitch
            name={'isdualstack'}
            label={t('network.isdualstack')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={5} className={classes.rowMargin}>
          <NmFormInputText
            fullWidth
            name={'addressrange6'}
            label={t('network.addressrange6')}
          />
        </Grid>
      </Grid>
    </NmForm>
  )
}
