import React from 'react'
import SwitchField from '@mui/material/Switch'
import { Controller } from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useFormControl } from './internal/formContext'
import { FormControlLabelProps } from '@mui/material'

export const NmFormInputSwitch: React.FC<{
  name: string
  label: string
  disabled?: boolean
  labelPlacement?: FormControlLabelProps['labelPlacement']
}> = ({ name, label, disabled, labelPlacement }) => {
  const { control, disabled: formDisabled } = useFormControl()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          disabled={formDisabled || disabled}
          labelPlacement={labelPlacement}
          control={
            <SwitchField
              checked={value}
              disabled={formDisabled || disabled}
              onChange={onChange}
              name={name}
            />
          }
          label={label}
        />
      )}
    />
  )
}
