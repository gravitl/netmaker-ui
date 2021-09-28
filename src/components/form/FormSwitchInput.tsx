import React, { useContext } from "react";
import SwitchField from "@mui/material/Switch";
import { Controller } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormContext } from "./Form";

export const NmFormInputSwitch: React.FC<{
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
            <SwitchField
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
