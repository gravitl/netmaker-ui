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
  UseFormReset,
  FieldValues,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormContext } from './internal/formContext'
import { AdminPanelSettings, Cancel } from '@mui/icons-material'
import { BACKEND_URL } from '../../config'

interface FormProps<T extends FieldValues> extends Omit<BoxProps, 'onSubmit' | 'component'> {
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
  onCancel?: () => void
}

export interface FormRef<T extends FieldValues> {
  reset: UseFormReset<T>
  values: UnpackNestedValue<T>
}

export const NmForm = React.forwardRef(function NmFormInternal<T extends FieldValues>(
  {
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
    onCancel,
    ...boxProps
  }: FormProps<T>,
  ref: React.ForwardedRef<FormRef<T>>
) {
  const { handleSubmit, reset, control, getValues } = useForm<T>({
    defaultValues: initialState,
    resolver,
  })

  React.useImperativeHandle(ref, () => ({
    reset,
    values: getValues(),
  }))

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
          <Grid item xs={8}>
            <Button
              {...submitProps}
              disabled={disabled}
              onClick={handleSubmit(onSubmit)}
            >
              {submitText ? submitText : t('common.submit')}
            </Button>
          </Grid>
          {showOauth ? (
            <Grid item xs={2}>
              <Tooltip placement="top" title={t('login.oauth.login') as string}>
                <IconButton
                  color="primary"
                  href={`${BACKEND_URL}/api/oauth/login`}
                >
                  <AdminPanelSettings />
                </IconButton>
              </Tooltip>
            </Grid>
          ) : null}
          {onCancel ? (
            <Grid item xs={1}>
              <Tooltip placement="top" title={t('common.cancel') as string}>
                <IconButton color="primary" onClick={onCancel}>
                  <Cancel />
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
})
