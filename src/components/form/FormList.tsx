import { useFieldArray } from 'react-hook-form'
import { useFormControl } from './internal/formContext'
import { FormControlLabelProps } from '@mui/material'
import { Modify } from 'src/types/react-app-env'

export function NmFormList<Row extends {}>({
  name,
  children,
  disabled,
}: {
  name: string
  disabled?: boolean
  labelPlacement?: FormControlLabelProps['labelPlacement']
  children: (
    fields: Array<Modify<Row, { id: string; getFieldName: (path: string) => string }>>,
    disabled: boolean
  ) => JSX.Element 
}) {
  const { control, disabled: formDisabled } = useFormControl()
  const { fields } = useFieldArray({
    control,
    name,
  })

  return children(
        fields.map((field, index) => ({
          ...field,
          getFieldName: (path: string) => `${name}.${index}.${path}`,
        } as any)),
        formDisabled || !!disabled
      )
}
