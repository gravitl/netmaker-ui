import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Button, Grid, Tooltip } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import {
  FormRef,
  NmForm,
  NmFormInputSwitch,
  NmFormInputText,
} from '../../../components/form'
import { useLinkBreadcrumb } from '../../../components/PathBreadcrumbs'
import { createNetwork, getNetworks } from '../../../store/modules/network/actions'
import { randomNetworkName, randomCIDR } from '~util/fields'
import { useHistory } from 'react-router'

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

const useStyles = makeStyles(() =>
  createStyles({
    center: {
      textAlign: 'center',
    },
    rowMargin: {
      marginTop: '1em',
      marginBottom: '1em',
    },
  })
)

export const NetworkCreate: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles()
  const [ viewLocal, setViewLocal ] = React.useState(false)
  const [ viewDual, setViewDual ] = React.useState(false)

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
      dispatch(
        getNetworks.request()
      )
      history.goBack()
    },
    [dispatch, history]
  )

  const formRef = React.createRef<FormRef<CreateNetwork>>()

  useLinkBreadcrumb({
    title: t('common.create'),
  })

  const handleViewDual = () => {
    setViewDual(!viewDual)
  }

  const handleViewLocal = () => {
    setViewLocal(!viewLocal)
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <NmForm
      initialState={initialState}
      onSubmit={onSubmit}
      submitProps={{
        variant: 'contained',
        fullWidth: true,
      }}
      submitText={t('network.create')}
      ref={formRef}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6} md={7} className={classes.center + ' ' + classes.rowMargin}>
          <Button
            onClick={() => {
              formRef.current?.reset(
                {
                  ...formRef.current?.values,
                  netid: randomNetworkName(),
                  addressrange: randomCIDR(),
                  defaultudpholepunch: true,
                },
                { keepDefaultValues: true }
              )
            }}
            style={{width: '33%'}}
            variant="outlined"
          >
            {t('common.autofill')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={7} className={classes.center + ' ' + classes.rowMargin}>
          <NmFormInputText
            style={{width: '90%'}}
            name={'netid'}
            label={`${t('network.netid')} (${t('common.max')} 12 ${t('common.chars')})`}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={7} className={classes.center + ' ' + classes.rowMargin}>
          <NmFormInputText
            style={{width: '90%'}}
            name={'addressrange'}
            label={t('network.addressrange')}
          />
        </Grid>
        <Grid item xs={12} sm={10} md={10} className={classes.center + ' ' + classes.rowMargin} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Tooltip title={t('helper.udpholepunching') as string} placement='top'>
            <div>
              <NmFormInputSwitch name={'defaultudpholepunch'} label={t('network.defaultudpholepunch')} />
            </div>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={12} md={10} className={classes.center + ' ' + classes.rowMargin} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Tooltip title={t('helper.islocal') as string} placement='top'>
            <div onClick={handleViewLocal}>
              <NmFormInputSwitch name={'islocal'} label={t('network.islocal')}/>
            </div>
          </Tooltip>
          {viewLocal &&
            <NmFormInputText
              style={{width: '60%'}}
              name={'localrange'}
              label={t('network.localrange')}
            />
          }
        </Grid>
        <Grid item xs={12} sm={12} md={10} className={classes.rowMargin} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div  onClick={handleViewDual}>
            <NmFormInputSwitch
              name={'isdualstack'}
              label={t('network.isdualstack')}
            />
          </div>
          {viewDual &&
            <NmFormInputText
              style={{width: '60%'}}
              name={'addressrange6'}
              label={t('network.addressrange6')}
            />
          }
        </Grid>
      </Grid>
    </NmForm>
    </div>
  )
}
