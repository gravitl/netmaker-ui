import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Button } from '@mui/material'
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

export const NetworkCreate: React.FC = () => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

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
      }}
      submitText={t('network.create')}
      sx={{
        paddingTop: '1em',
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        flexWrap: 'wrap',
        '& .MuiTextField-root': {
          m: 1,
          width: '25ch',
          justifyContent: 'center',
          flex: '2 0 60%',
        },
        '& .MuiSwitch-root': {
          m: 1,
          justifyContent: 'center',
          flex: '`1 0 25%',
        },
        '& .MuiButton-root': {
          m: 1,
          justifyContent: 'center',
          flex: '0 0 20%',
        },
      }}
      ref={formRef}
    >
      <NmFormInputText name={'netid'} label={t('network.netid')} />
      <NmFormInputText
        name={'addressrange'}
        label={t('network.addressrange')}
      />
      <NmFormInputSwitch
        name={'defaultudpholepunch'}
        label={t('network.defaultudpholepunch')}
      /> 
      <NmFormInputSwitch name={'islocal'} label={t('network.islocal')} />
      <NmFormInputText name={'localrange'} label={t('network.localrange')} />
      <NmFormInputSwitch
        name={'isdualstack'}
        label={t('network.isdualstack')}
      />
      <NmFormInputText
        name={'addressrange6'}
        label={t('network.addressrange6')}
      />
      <Button onClick={() => {
        console.log("Prefill Button Press ", formRef.current)
        formRef.current?.reset({...formRef.current?.values, netid: randomNetworkName(), addressrange: randomCIDR()}, { keepDefaultValues: true})
      }}
        variant='contained'
      >
         {t('common.autofill')}
        </Button>
      <br />
    </NmForm>
  )
}
