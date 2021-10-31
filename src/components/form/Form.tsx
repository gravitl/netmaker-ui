import React from 'react'
import {
  Button,
  ExtendButtonBase,
  ButtonTypeMap,
  Box,
  BoxProps,
} from '@mui/material'
import {
  useForm,
  SubmitHandler,
  UnpackNestedValue,
  Resolver,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormContext } from './internal/formContext'

interface FormProps<T> extends Omit<BoxProps, 'onSubmit' | 'component'> {
  initialState: UnpackNestedValue<T>
  disabled?: boolean
  submitText?: string
  resetText?: string
  showReset?: boolean
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
        <Button {...submitProps} onClick={handleSubmit(onSubmit)}>
          {submitText ? submitText : t('common.submit')}
        </Button>
        {showReset && (
          <Button {...resetProps} onClick={() => reset()} variant={'outlined'}>
            {resetText ? resetText : t('common.reset')}
          </Button>
        )}
      </Box>
    </FormContext.Provider>
  )
}
