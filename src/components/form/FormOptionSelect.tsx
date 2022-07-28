import React from 'react'
import { TextFieldProps } from '@mui/material/TextField/TextField'
import { Controller } from 'react-hook-form'
import { useFormControl } from './internal/formContext'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export const NmFormOptionSelect: React.FC<
  Omit<
    TextFieldProps,
    'name' | 'onChange' | 'value' | 'error' | 'helperText' | 'rightAlign'
  > & {
    name: string
    rightAlign?: boolean
    selections: {key: string, option: any}[]
  }
> = ({ name, disabled, rightAlign, selections, ...textfieldProps }) => {
  const { control, disabled: formDisabled } = useFormControl()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl sx={{ minWidth: '80%' }}>
        <InputLabel id={`select-${value}`}>{textfieldProps.label}</InputLabel>
        <Select
          disabled={formDisabled}
          labelId="simple-select-label"
          id="simple-select-label"
          value={value}
          label={textfieldProps.label}
          onChange={onChange}
          fullWidth
        >
          {selections.map(({key, option}) =>
            <MenuItem key={key} value={option}>{key}</MenuItem>
          )}
        </Select>
      </FormControl>
      )}
    />
  )
}
