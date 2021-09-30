import React, { useContext } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField/TextField";
import { Controller } from "react-hook-form";
import { FormContext } from "./Form";

export const NmFormInputText: React.FC<
  Omit<TextFieldProps, "name" | "onChange" | "value" | "errr" | "helperText"> & {
    name: string;
  }
> = ({ name, disabled, ...textfieldProps }) => {
  const context = useContext(FormContext);

  return (
    <Controller
      name={name}
      control={context.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          {...textfieldProps}
          onChange={onChange}
          disabled={context.disabled || disabled}
          value={value}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};
