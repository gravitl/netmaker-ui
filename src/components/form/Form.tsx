import React from 'react'
import {
  IconButton,
  Button,
  ExtendButtonBase,
  ButtonTypeMap,
  Box,
  BoxProps,
  Grid,
  Tooltip,
} from '@mui/material'
import {
  useForm,
  SubmitHandler,
  UnpackNestedValue,
  Resolver,
  DeepPartial,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormContext } from './internal/formContext'
import { VpnKey } from '@mui/icons-material'

interface FormProps<T> extends Omit<BoxProps, 'onSubmit' | 'component'> {
  initialState: UnpackNestedValue<DeepPartial<T>>
  disabled?: boolean
  submitText?: string
  resetText?: string
  showReset?: boolean
  showOauth?: boolean
  onSubmit: SubmitHandler<T>
  children?: React.ReactNode
  submitProps?: Omit<ExtendButtonBase<ButtonTypeMap>, 'onChange'>
  resetProps?: Omit<ExtendButtonBase<ButtonTypeMap>, 'onChange'>
  resolver?: Resolver<T, object>
}

export function NmForm<T>({
  initialState,
  disabled,
  showReset,
  submitText,
  resetText,
  children,
  onSubmit,
  submitProps,
  resetProps,
  showOauth,
  resolver,
  ...boxProps
}: FormProps<T>) {
  const { handleSubmit, reset, control } = useForm<T>({
    defaultValues: initialState,
    resolver,
  })

  const { t } = useTranslation()

  return (
    <FormContext.Provider
      value={{
        control,
        disabled: disabled || false,
      }}
    >
      <Box {...boxProps} component="form">
        {children}
        <br />
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item xs={10}>
            <Button {...submitProps} onClick={handleSubmit(onSubmit)}>
              {submitText ? submitText : t('common.submit')}
            </Button>
          </Grid>
          {showOauth ? (
            <Grid item xs={1}>
              <Tooltip placement="top" title={t('login.oauth.login') as string}>
                <IconButton color="primary">
                  <VpnKey />
                </IconButton>
              </Tooltip>
            </Grid>
          ) : null}
        </Grid>
        {showReset && (
          <Button {...resetProps} onClick={() => reset()} variant={'outlined'}>
            {resetText ? resetText : t('common.reset')}
          </Button>
        )}
      </Box>
    </FormContext.Provider>
  )
}
