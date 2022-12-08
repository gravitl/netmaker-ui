import React from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField/TextField'
import { Controller } from 'react-hook-form'
import { FormContext } from './internal/formContext'

export const NmFormInputText: React.FC<
  Omit<
    TextFieldProps,
    'name' | 'onChange' | 'value' | 'error' | 'helperText' | 'rightAlign'
  > & {
    name: string
    rightAlign?: boolean
  }
> = ({ name, disabled, rightAlign, ...textfieldProps }) => {

  return (
    <FormContext.Consumer>
      {({ control, disabled: formDisabled }) => (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
            <TextField
              {...textfieldProps}
              onChange={onChange}
              disabled={formDisabled || disabled}
              value={value}
              error={!!error}
              helperText={error?.message}
              inputRef={ref}
              inputProps={
                rightAlign
                  ? {
                      style: {
                        textAlign: 'right',
                      },
                    }
                  : {}
              }
            />
          )}
        />
      )}
    </FormContext.Consumer>
  )
}
