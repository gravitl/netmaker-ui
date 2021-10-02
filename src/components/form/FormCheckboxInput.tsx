import React from "react";
import CheckboxField from "@mui/material/Checkbox";
import { Controller } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useFormControl } from "./internal/formContext";

export const NmFormInputCheckbox: React.FC<{
  name: string;
  label: string;
  disabled?: boolean;
}> = ({ name, label, disabled }) => {
  const { control, disabled: formDisabled} = useFormControl();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          disabled={formDisabled || disabled}
          control={
            <CheckboxField
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
  );
};
