import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Button, Grid, Tooltip } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import {
  FormRef,
  NmForm,
  NmFormInputSwitch,
  NmFormInputText,
  validate,
} from '../../../components/form'
import { useLinkBreadcrumb } from '../../../components/PathBreadcrumbs'
import {
  createNetwork,
  getNetworks,
} from '../../../store/modules/network/actions'
import { randomNetworkName, randomCIDR, randomCIDR6 } from '~util/fields'
import { useHistory } from 'react-router'
import { correctIPv4CidrRegex, correctIpv6Regex } from '~util/regex'

interface CreateNetwork {
  addressrange: string
  netid: string
  localrange: string
  islocal: boolean
  isipv4: boolean
  isipv6: boolean
  addressrange6: string
  defaultudpholepunch: boolean
  ispointtosite: boolean
  defaultacl: boolean
}

const initialState: CreateNetwork = {
  addressrange: '',
  netid: '',
  localrange: '',
  islocal: false,
  isipv4: true,
  isipv6: false,
  addressrange6: '',
  defaultudpholepunch: false,
  ispointtosite: false,
  defaultacl: true,
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
  const [viewLocal, setViewLocal] = React.useState(false)
  const [useIpv4, setUseIpv4] = React.useState(true)
  const [useIpv6, setUseIpv6] = React.useState(false)

  const onSubmit = useCallback(
    (data: CreateNetwork) => {
      dispatch(
        createNetwork.request({
          ...data,
          islocal: data.islocal ? 'yes' : 'no',
          isipv4: data.isipv4 ? 'yes' : 'no',
          isipv6: data.isipv6 ? 'yes' : 'no',
          addressrange6: data.isipv6 ? data.addressrange6 : '',
          addressrange: data.isipv4 ? data.addressrange : '',
          defaultudpholepunch: data.defaultudpholepunch ? 'yes' : 'no',
          ispointtosite: data.ispointtosite ? 'yes' : 'no',
          defaultacl: data.defaultacl ? 'yes' : 'no',
        })
      )
      dispatch(getNetworks.request())
      history.push('/networks')
    },
    [dispatch, history]
  )
  //create ip validation with messages
  const createipValidation = useMemo(
    () =>
      validate<CreateNetwork>({
        addressrange: (addressrange, formData) => {
          if (!formData.isipv4) {
            return undefined
          }
          return !correctIPv4CidrRegex.test(addressrange)
            ? {
                message: t('network.validation.ipv4'),
                type: 'value',
              }
            : undefined
        },
        addressrange6: (addressrange6, formData) => {
          if (!formData.isipv6) {
            return undefined
          }
          return !correctIpv6Regex.test(addressrange6)
            ? {
                message: t('network.validation.ipv6'),
                type: 'value',
              }
            : undefined
        },
      }),
    [t]
  )

  const formRef = React.createRef<FormRef<CreateNetwork>>()

  useLinkBreadcrumb({
    title: t('common.create'),
  })

  const handleViewIpv6 = () => {
    setUseIpv6(!useIpv6)
  }

  const handleViewIpv4 = () => {
    setUseIpv4(!useIpv4)
  }

  const handleViewLocal = () => {
    setViewLocal(!viewLocal)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <NmForm
        initialState={initialState}
        resolver={createipValidation}
        onSubmit={onSubmit}
        submitProps={{
          variant: 'contained',
          fullWidth: true,
        }}
        submitText={t('network.create')}
        ref={formRef}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid
            item
            xs={12}
            sm={6}
            md={7}
            className={classes.center + ' ' + classes.rowMargin}
          >
            <Button
              onClick={() => {
                formRef.current?.reset(
                  {
                    ...formRef.current?.values,
                    netid: randomNetworkName(),
                    addressrange: useIpv4 ? randomCIDR() : '',
                    addressrange6: useIpv6 ? randomCIDR6() : '',
                    defaultudpholepunch: true,
                  },
                  { keepDefaultValues: true }
                )
              }}
              style={{ width: '33%' }}
              variant="outlined"
            >
              {t('common.autofill')}
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={7}
            className={classes.center + ' ' + classes.rowMargin}
          >
            <NmFormInputText
              style={{ width: '90%' }}
              name={'netid'}
              label={`${t('network.netid')} (${t('common.max')} 12 ${t(
                'common.lowercase'
              )} ${t('common.chars')})`}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={10}
            className={classes.rowMargin}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip title={t('helper.ipv4') as string}>
              <div onClick={handleViewIpv4}>
                <NmFormInputSwitch
                  name={'isipv4'}
                  label={String(t('network.isipv4'))}
                />
              </div>
            </Tooltip>
            {useIpv4 && (
              <NmFormInputText
                style={{ width: '60%' }}
                name={'addressrange'}
                label={String(t('network.addressrange'))}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={10}
            className={classes.rowMargin}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip title={t('helper.ipv6') as string}>
              <div onClick={handleViewIpv6}>
                <NmFormInputSwitch
                  name={'isipv6'}
                  label={String(t('network.isipv6'))}
                />
              </div>
            </Tooltip>
            {useIpv6 && (
              <NmFormInputText
                style={{ width: '60%' }}
                name={'addressrange6'}
                label={String(t('network.addressrange6'))}
              />
            )}
          </Grid>
          {/* <Grid item xs={12} sm={12} md={7} className={classes.center + ' ' + classes.rowMargin}>
          <NmFormInputText
            style={{width: '90%'}}
            name={'addressrange'}
            label={String(t('network.addressrange'))}
          />
        </Grid> */}
          <Grid
            item
            xs={12}
            sm={10}
            md={10}
            className={classes.center + ' ' + classes.rowMargin}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip
              title={t('helper.udpholepunching') as string}
              placement="top"
            >
              <div>
                <NmFormInputSwitch
                  name={'defaultudpholepunch'}
                  label={String(t('network.defaultudpholepunch'))}
                />
              </div>
            </Tooltip>
          </Grid>
          <Grid
            item
            xs={12}
            sm={10}
            md={10}
            className={classes.center + ' ' + classes.rowMargin}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip title={t('helper.defaultacl') as string} placement="top">
              <div>
                <NmFormInputSwitch
                  name={'defaultacl'}
                  label={String(t('network.defaultacl'))}
                />
              </div>
            </Tooltip>
          </Grid>
          <Grid
            item
            xs={12}
            sm={10}
            md={10}
            className={classes.center + ' ' + classes.rowMargin}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip
              title={t('helper.ispointtosite') as string}
              placement="top"
            >
              <div>
                <NmFormInputSwitch
                  name={'ispointtosite'}
                  label={String(t('network.ispointtosite'))}
                />
              </div>
            </Tooltip>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={10}
            className={classes.center + ' ' + classes.rowMargin}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip title={t('helper.islocal') as string} placement="top">
              <div onClick={handleViewLocal}>
                <NmFormInputSwitch
                  name={'islocal'}
                  label={String(t('network.islocal'))}
                />
              </div>
            </Tooltip>
            {viewLocal && (
              <NmFormInputText
                style={{ width: '60%' }}
                name={'localrange'}
                label={String(t('network.localrange'))}
              />
            )}
          </Grid>
        </Grid>
      </NmForm>
    </div>
  )
}
