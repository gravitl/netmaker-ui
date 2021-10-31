import React, { useContext } from 'react'
import { Control } from 'react-hook-form'

export const FormContext = React.createContext<{
  control: Control<any, object>
  disabled: boolean
}>({ disabled: false, control: {} as any })

export const useFormControl = () => useContext(FormContext)
