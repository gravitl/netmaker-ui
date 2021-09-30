import React, { useContext } from "react";
import CheckboxField from "@mui/material/Checkbox";
import { Controller } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormContext } from "./Form";

export const NmFormInputCheckbox: React.FC<{
  name: string;
  label: string;
  disabled?: boolean;
}> = ({ name, label, disabled }) => {
  const context = useContext(FormContext);
  return (
    <Controller
      name={name}
      control={context.control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          disabled={context.disabled || disabled}
          control={
            <CheckboxField
              checked={value}
              disabled={context.disabled || disabled}
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
