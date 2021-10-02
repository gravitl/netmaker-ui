import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField/TextField";
import { Controller } from "react-hook-form";
import { useFormControl } from "./internal/formContext";

export const NmFormInputText: React.FC<
  Omit<TextFieldProps, "name" | "onChange" | "value" | "error" | "helperText"> & {
    name: string;
  }
> = ({ name, disabled, ...textfieldProps }) => {
  const { control, disabled: formDisabled} = useFormControl();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          {...textfieldProps}
          onChange={onChange}
          disabled={formDisabled || disabled}
          value={value}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};
