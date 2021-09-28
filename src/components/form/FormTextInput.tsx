import React, { useContext } from "react";
import TextField from "@mui/material/TextField/TextField";
import { Controller } from "react-hook-form";
import { FormContext } from "./Form";

export const NmFormInputText: React.FC<{
  name: string;
  label: string;
  disabled?: boolean;
  placeholder?: string;
}> = ({ name, label, disabled }) => {
  const context = useContext(FormContext);

  return (
    <Controller
      name={name}
      control={context.control}
      render={({ field: { onChange, value } }) => (
        <TextField
          onChange={onChange}
          disabled={context.disabled || disabled}
          value={value}
          label={label}
        />
      )}
    />
  );
};
